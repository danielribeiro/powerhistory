ui = {}
_xul_list =
    ['action', 'arrowscrollbox', 'assign', 'bbox', 'binding', 'bindings', 'box', 'broadcaster',
'broadcasterset', 'button', 'browser', 'checkbox', 'caption', 'colorpicker', 'column',
'columns', 'commandset', 'command', 'conditions', 'content', 'datepicker', 'deck',
'description', 'dialog', 'dialogheader', 'dropmarker', 'editor', 'grid', 'grippy',
'groupbox', 'hbox', 'iframe', 'image', 'key', 'keyset', 'label', 'listbox', 'listcell',
'listcol', 'listcols', 'listhead', 'listheader', 'listitem', 'member', 'menu', 'menubar',
'menuitem', 'menulist', 'menupopup', 'menuseparator', 'notification', 'notificationbox',
'observes', 'overlay', 'page', 'panel', 'param', 'popupset', 'preference', 'preferences',
'prefpane', 'prefwindow', 'progressmeter', 'query', 'queryset', 'radio', 'radiogroup',
'resizer', 'richlistbox', 'richlistitem', 'row', 'rows', 'rule', 'scale', 'script',
'scrollbar', 'scrollbox', 'scrollcorner', 'separator', 'spacer', 'spinbuttons',
'splitter', 'stack', 'statusbar', 'statusbarpanel', 'stringbundle', 'stringbundleset',
'tab', 'tabbrowser', 'tabbox', 'tabpanel', 'tabpanels', 'tabs', 'template', 'textnode',
'textbox', 'timepicker', 'titlebar', 'toolbar', 'toolbarbutton', 'toolbargrippy',
'toolbaritem', 'toolbarpalette', 'toolbarseparator', 'toolbarset', 'toolbarspacer',
'toolbarspring', 'toolbox', 'tooltip', 'tree', 'treecell', 'treechildren', 'treecol',
'treecols', 'treeitem', 'treerow', 'treeseparator', 'triple', 'vbox', 'where',
'window', 'wizard', 'wizardpage']


_addAllTo = (target, args) ->
    target.appendChild i for i in args
    return target

dumpobj = (obj) ->
    ret = "#{k} = #{v.toString()}" for k, v in obj
    return ret.join ", "

# To allows us to use functions instead of strings on commands and clicks handlers
class CallbackStorage
    constructor: -> @counter = 0

    addFunction: (f) ->
        mname = "_innerFunction#{@counter}"
        body = "_Callbacks.#{mname}(event);"
        @counter++
        @[mname] = f
        return body


@_Callbacks = new CallbackStorage()

for element in _xul_list
    ui[element] = (atr) ->
        ret = document.createElement element
        ret.setAttribute(k, v) for k, v of atr if atr?
        ret.add = (args...) -> _addAllTo ret, args
        ret.text = (args) ->
            return ret.textContent unless args?
            ret.textContent = args
            return ret
        ret.xclick = (func) ->
            ret.setAttribute 'onclick', _Callbacks.addFunction(func)
            return ret
        ret.xcommand = (func) ->
            ret.setAttribute 'oncommand', _Callbacks.addFunction(func)
            return ret
        return ret


$ = (name) -> document.getElementById name
addTo = (name, args...) -> _addAllTo $(name), args


# Coffescript version of code on
# https://developer.mozilla.org/en/Creating_Sandboxed_HTTP_Connections
class StreamListener
    constructor: (@channel, @mCallbackFunc) ->

    mData: ""

    #nsIStreamListener
    onStartRequest: (aRequest, aContext) ->
        @mData = ""

    onDataAvailable: (aRequest, aContext, aStream, aSourceOffset, aLength) ->
        scriptableInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"]
            .createInstance(Components.interfaces.nsIScriptableInputStream);
        scriptableInputStream.init(aStream)
        @mData += scriptableInputStream.read(aLength)

    onStopRequest: (aRequest, aContext, aStatus) ->
        if Components.isSuccessCode(aStatus)
            #request was successfull
            @mCallbackFunc(@mData)
        else
            @mCallbackFunc(null)
        @channel = null

    #nsIChannelEventSink
    onChannelRedirect: (aOldChannel, aNewChannel, aFlags) ->
        #if redirecting, store the new channel
        @channel = aNewChannel

    #nsIInterfaceRequestor
    getInterface: (aIID) ->
        try
            return @queryInterface(aIID)
        catch e
          throw Components.results.NS_NOINTERFACE

    #nsIProgressEventSink (not implementing will cause annoying exceptions)
    onProgress: (aRequest, aContext, aProgress, aProgressMax) ->
        return

    onStatus: (aRequest, aContext, aStatus, aStatusArg) ->
        return

    #nsIHttpEventSink (not implementing will cause annoying exceptions)
    onRedirect : (aOldChannel, aNewChannel) ->
        return

    #we are faking an XPCOM interface, so we need to implement QI
    queryInterface : (aIID)->
        ns = Components.interfaces
        if aIID.equals(ns.nsISupports) ||
            aIID.equals(ns.nsIInterfaceRequestor) ||
            aIID.equals(ns.nsIChannelEventSink) ||
            aIID.equals(ns.nsIProgressEventSink) ||
            aIID.equals(ns.nsIHttpEventSink) ||
            aIID.equals(ns.nsIStreamListener)
          return @
        throw Components.results.NS_NOINTERFACE;

KEY_ENTER = 13
class PowerHistoryClass
    text: (label) -> ui.description().text(label)

    datepicker: -> ui.datepicker(type:'popup', disabled: true)

    handleKey: (event) ->
        @search() if event.keyCode == KEY_ENTER

    constructor: ->
        @searchinput = ui.textbox()
        @searchinput.addEventListener('keypress', ((e) => @handleKey(e)), true)

        @content = ui.treechildren()
        @contentList = ui.tree(hidecolumnpicker: true, flex: 1
            , seltype: 'single').xclick((e) => @onClick e)
        @to = @datepicker()
        @from = @datepicker()
        @withinDate = ui.checkbox(label: "Limit by Date").xcommand =>
            for datePicker in [@to, @from]
                datePicker.setAttribute 'disabled', !@withinDate.checked
        @gBrowser = @constructGBrowser()

    constructGBrowser: ->
        window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
            .getInterface(Components.interfaces.nsIWebNavigation)
            .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
            .rootTreeItem
            .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
            .getInterface(Components.interfaces.nsIDOMWindow).gBrowser

    onLoad: ->
        searchMenu = ui.box(align: 'center').add(
            @searchinput,
            ui.button(label: 'Search ').xcommand(=> @search()),
            ui.checkbox(label: "Search Inside Page's content")
        )
        dataRange = ui.box().add @text('From:'), @from,
            @text('To:'), @to, @withinDate
        searchBox = ui.vbox().add ui.spacer(height: '15'),
            @text('Power History'), searchMenu, ui.spacer(height: '15'), dataRange
        addTo 'pwwindow', searchBox, @createContent()


    addTab: (url) -> @gBrowser.addTab url

    clearContent: ->
        while @content.hasChildNodes()
            @content.removeChild @content.firstChild
        return

    addToContent: (row) ->
        newRow = ui.treerow()
        for i in row
            newRow.add ui.treecell(label:i)
        @content.add ui.treeitem().add newRow

    createContent: ->
        columns = ui.treecols()
        for column, size of {Title:40, Url:40, 'Visit #':1, 'Last visited':25}
            columns.add ui.treecol(label: column, flex: size, fixed: false)
            columns.add ui.splitter(width: 0) unless column is 'Last visited'
        @contentList.add columns, @content
        return @contentList

    searchHistory: (queryString) ->
        words = queryString.split /\s+/
        likeParts = @urlOrTitleHas(w) for w in words
        likeQuery =  likeParts.join(' AND ')
        query = "SELECT url, title, visit_count, last_visit_date FROM moz_places
        where url like 'http:%' AND (#{likeQuery}) #{@_datePart()} order by last_visit_date
        desc limit 100"
        #alert query
        return @_executeQuery query

    _datePart: () ->
        return "" unless @withinDate.checked
        fromDate = @from.dateValue.valueOf() * 1000
        toDate = @to.dateValue.valueOf() * 1000
        return "AND (last_visit_date BETWEEN #{fromDate} AND #{toDate})"

    _likePart: (col, value) -> "(#{col} LIKE '%#{value}%')"

    urlOrTitleHas: (w) -> '(' + @_likePart('url', w )+ ' OR ' + @_likePart('title', w) + ')'

    search: ->
        value = @searchinput.value.trim()
        return if value is ''
        regex = new RegExp @searchinput.value, 'i'
        # @searchWithin 'http://news.ycombinator.com/item?id=1981547', regex
        @clearContent()
        for i in @searchHistory(value)
            @addToContent [i.title, i.uri, i.accessCount, new Date(i.time / 1000)]

    onClick: (event) ->
        tree = @contentList
        tbo = tree.treeBoxObject

        # get the row, col and child element at the point
        row = {}
        col = {}
        tbo.getCellAt event.clientX, event.clientY, row, col, {}
        try
            urlcolumn = tbo.columns.getColumnAt 1
            page = tree.view.getCellText(row.value, urlcolumn)
            @addTab page
        catch error
            return

    makeRequest: (url, callback) ->
        ioService = Components.classes["@mozilla.org/network/io-service;1"]
            .getService(Components.interfaces.nsIIOService)
        uri = ioService.newURI url, null, null
        channel = ioService.newChannelFromURI uri
        listener = new StreamListener channel, callback
        channel.asyncOpen listener, null

    searchWithin: (url, regex) ->
        @makeRequest url, (data) =>
            if @_stripHtml(data).search(regex) >= 0
                @addResult url
            else
                @noResultFor url

    addResult: (url) -> @addToContent ['title', url, 'accessCount', 'time']

    noResultFor: (url) ->
        return

    _stripHtml: (text) -> text.replace /<.*?>/g, ''


    _executeQuery: (query) ->
        db = Components.classes['@mozilla.org/browser/nav-history-service;1']
            .getService(Components.interfaces.nsPIPlacesDatabase).DBConnection
        sql_stmt = db.createStatement query
        return @_normalizeRow(sql_stmt.row) while sql_stmt.executeStep()

    _normalizeRow: (r) ->
        ret =
            title: r.title
            uri: r.url
            accessCount: r.visit_count
            time: r.last_visit_date
        return ret



@PowerHistory = new PowerHistoryClass()