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

# To allows us to use functions instead of strings on commands and clicks
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
            ret.setAttribute 'onClick', _Callbacks.addFunction(func)
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
        if aIID.equals(Components.interfaces.nsISupports) ||
            aIID.equals(Components.interfaces.nsIInterfaceRequestor) ||
            aIID.equals(Components.interfaces.nsIChannelEventSink) ||
            aIID.equals(Components.interfaces.nsIProgressEventSink) ||
            aIID.equals(Components.interfaces.nsIHttpEventSink) ||
            aIID.equals(Components.interfaces.nsIStreamListener)
          return @
        throw Components.results.NS_NOINTERFACE;


class PowerHistoryClass
    text: (label) -> ui.description().text(label)

    datepicker: -> ui.datepicker(type:'popup', disabled: true)

    constructor: ->
        @searchinput = ui.textbox()
        @content = ui.treechildren()
        @contentList = ui.tree(hidecolumnpicker: true, flex: 1
            , seltype: 'single').xclick( (e) -> alert 'invoked')
        @to = @datepicker()
        @from = @datepicker()

    onLoad: ->
        searchMenu = ui.box(align: 'center').add(
            @searchinput,
            ui.button(label: 'Search ', oncommand:"PowerHistory.search();"),
            ui.checkbox(label: "Search Inside Page's content"))
        )
        dataRange = ui.box().add @text('From:'), @from,
            @text('To:'), @to, ui.checkbox(label: "Limit by Date")
        searchBox = ui.vbox().add ui.spacer(height: '15'),
            @text('Power History'), searchMenu, dataRange
        addTo 'pwwindow', searchBox, @createContent()
        _Callbacks._innerFunction(0)

    addToContent: (row) ->
        newRow = ui.treerow()
        for i in row
            newRow.add ui.treecell(label:i)
        @content.add ui.treeitem().add newRow

    createContent: ->
        columns = ui.treecols()
        for column in ['Title', 'Icon', 'Url', 'How many times visited', 'Last visited']
            columns.add ui.treecol(label: column, flex: 1)
        @contentList.add columns, @content
        return @contentList


    showhistory: (query) ->
        historyService = Components.classes["@mozilla.org/browser/nav-history-service;1"]
            .getService(Components.interfaces.nsINavHistoryService)
        query = historyService.getNewQuery()
        query.searchTerms = query
        options = historyService.getNewQueryOptions()
        options.sortingMode = options.SORT_BY_VISITCOUNT_DESCENDING
        options.maxResults = 10

        #execute the query
        result = historyService.executeQuery(query, options)

        #iterate over the results
        result.root.containerOpen = true
        count = result.root.childCount
        ret = result.root.getChild(i) for i in [0..(count-1)]
        result.root.containerOpen = false
        return ret

    search: ->
        return if @searchinput.value.trim() is ''
        regex = new RegExp @searchinput.value, 'i'
        @searchWithin 'http://news.ycombinator.com/item?id=1981547', regex
        # for i in @showhistory(@searchinput.value)
        #     @addToContent @getFrom i, 'title', 'icon', 'uri', 'accessCount', 'time'

    onClick: (event) ->
        tree = @contentList
        tbo = tree.treeBoxObject

        # get the row, col and child element at the point
        row = {}
        col = {}
        tbo.getCellAt event.clientX, event.clientY, row, col, {}
        try
            # firstcol = col.value.columns.getColumnAt(0)
            firstcol = tbo.columns.getColumnAt(0)
            cellText = tree.view.getCellText(row.value, firstcol)
            alert "the text=#{cellText} row = #{row.value} col = #{col.value}"
        catch error
            return

    getFrom: (obj, args...) -> obj[arg] for arg in args

    makeRequest: (url, callback) ->
        ioService = Components.classes["@mozilla.org/network/io-service;1"]
            .getService(Components.interfaces.nsIIOService)
        uri = ioService.newURI url, null, null
        channel = ioService.newChannelFromURI uri
        listener = new StreamListener channel, callback
        channel.asyncOpen listener, null

    searchWithin: (url, regex) ->
        @makeRequest url, (data) =>
            if data.search(regex) >= 0
                @addResult url
            else
                @noResultFor url

    addResult: (url) ->
        @addToContent ['title', 'icon', url, 'accessCount', 'time']

    noResultFor: (url) ->
        return

    stripHtml: (text) -> text.replace /<.*?>/g, ''



@PowerHistory = new PowerHistoryClass()