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
    ret = ("#{k} = #{v.toString()}" for k, v in obj)
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


window._Callbacks = new CallbackStorage()

_createElement = (element) ->
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

for element in _xul_list
    _createElement(element)


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

class AsyncCounter
    constructor: ->
        @counterDisplay = ui.description(collapsed: true).text("(1/1)")
        loadingUrl = "chrome://global/skin/icons/loading_16.png"
        @searchingIndicator = ui.box(collapsed: true)
            .add(ui.image(src: loadingUrl, maxwidth: 16, maxheight: 16),
                @counterDisplay,
                ui.description(style: "font: 1.2em bold;").text("Searching..."))
        @reset()

    reset: ->
        @current = 0
        @total = 0
        @done = 0
        @counterDisplay.collapsed = true

    display: -> @searchingIndicator

    isDone: -> @current == 0

    updateDisplay: ->
        return if @total <= 1
        @counterDisplay.textContent = "(#{@done}/#{@total})"
        @counterDisplay.collapsed = false

    inc: ->
        @total++
        @current++
        @updateDisplay()
        @searchingIndicator.collapsed = false

    dec: ->
        @done++
        @current--
        @updateDisplay()
        @searchingIndicator.collapsed = true if @isDone()

# Simple set
class Set
    constructor: (array) ->
        @data = {}
        @add i for i in array if array?
    add: (o) -> @data[o] = o
    remove: (o) -> delete @data[o]
    include: (o) -> @data[o]

    each: (fn) ->
        for k, v of @data
            fn v
        return

    empty: ->
        for k of @data
            return false
        return true


KEY_ENTER = 13
class PowerHistoryClass
    text: (label) -> ui.description().text(label)

    datepicker: -> ui.datepicker(type:'popup', disabled: true)

    handleKey: (event) ->
        @search() if event.keyCode == KEY_ENTER

    constructor: ->
        @visitedDomains = new Set()
        @asyncCounter = new AsyncCounter()
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
        @searchWithinBox = ui.checkbox(label: "Search Inside Page's content")
        @ioService = Components.classes["@mozilla.org/network/io-service;1"]
            .getService(Components.interfaces.nsIIOService)



    constructGBrowser: ->
        window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
            .getInterface(Components.interfaces.nsIWebNavigation)
            .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
            .rootTreeItem
            .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
            .getInterface(Components.interfaces.nsIDOMWindow).gBrowser

    onLoad: ->
        searchMenu = ui.box().add(
            @searchinput,
            ui.button(label: 'Search ').xcommand(=> @search()),
            @searchWithinBox
        )
        dataRange = ui.box().add @text('From:'), @from,
            @text('To:'), @to, @withinDate
        searchBox = ui.vbox().add ui.spacer(height: '15'),
            @text('Power History'), searchMenu, ui.spacer(height: '15'), dataRange
        metaSearch = ui.vbox().add ui.spacer(height: '15'), @asyncCounter.display()
        menu = ui.box().add searchBox, metaSearch
        addTo 'pwwindow', menu, @createContent()

    clearContent: ->
        @visitedDomains = new Set()
        @asyncCounter.reset()
        while @content.hasChildNodes()
            @content.removeChild @content.firstChild
        return

    addToContent: (i) ->
        newRow = ui.treerow()
        for value in [i.title, i.url, i.visit_count, new Date(i.last_visit_date / 1000)]
            newRow.add ui.treecell(label:value)
        @content.add ui.treeitem().add newRow
        return

    createContent: ->
        columns = ui.treecols()
        for column, size of {Title:40, Url:40, 'Visit #':1, 'Last visited':25}
            columns.add ui.treecol(label: column, flex: size, fixed: false)
            columns.add ui.splitter(width: 0) unless column is 'Last visited'
        @contentList.add columns, @content
        return @contentList

    search: ->
        value = @searchinput.value.trim()
        return if value is ''
        @clearContent()
        @showIndicator()
        @searchHistory value.split /\s+/


    searchHistory: (words) ->
        return @withinSearchHistory words if @searchWithinBox.checked
        @basicSearchHistory words


    confirmBigData: ->
        prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
            .getService(Components.interfaces.nsIPromptService)
        check = { value: true }
        info = "This query may take a long time."
        result = prompts.confirmCheck null, info,
            "Are you sure?", "Don't ask again", check

    withinSearchHistory: (words, fn) ->
        unless @withinDate.checked
            unless @confirmBigData()
                @hideIndicator()
                return
        regexes = (new RegExp(word, 'i') for word in words)
        query = "SELECT url, title, visit_count, last_visit_date FROM moz_places
        where url like 'http:%' #{@_datePart()} order by last_visit_date
        desc"
        @_executeSearchQuery query, (row) => @searchForAllWithin row, regexes

    searchForAllWithin: (i, regexes) ->
        missingRegexes = new Set regexes
        @matchesOn(i.title, missingRegexes)
        @matchesOn(i.url, missingRegexes)
        return @addToContent i if missingRegexes.empty()
        @showIndicator()
        @makeRequest i.url, (data) =>
            @matchesOn(@_stripHtml(data), missingRegexes, i.url)
            @addToContent i if missingRegexes.empty()
            @hideIndicator()

    matchesOn: (str, patternSet) ->
        patternSet.each (pattern) ->
            patternSet.remove pattern if str.search(pattern) >= 0
        return

    basicSearchHistory: (words) ->
        likeParts = (@urlOrTitleHas(w) for w in words)
        likeQuery =  likeParts.join(' AND ')
        query = "SELECT url, title, visit_count, last_visit_date FROM moz_places
        where url like 'http:%' AND (#{likeQuery}) #{@_datePart()} order by last_visit_date
        desc"
        @_executeSearchQuery query, (i) => @addToContent i

    _datePart: () ->
        return "" unless @withinDate.checked
        fromDate = @from.dateValue.valueOf() * 1000
        toDate = @to.dateValue.valueOf() * 1000
        return "AND (last_visit_date BETWEEN #{fromDate} AND #{toDate})"

    _likePart: (col, value) -> "(#{col} LIKE '%#{value}%')"

    urlOrTitleHas: (w) -> '(' + @_likePart('url', w )+ ' OR ' + @_likePart('title', w) + ')'



    onClick: (event) ->
        tree = @contentList
        tbo = tree.treeBoxObject
        row = {}
        col = {}
        tbo.getCellAt event.clientX, event.clientY, row, col, {}
        try
            urlcolumn = tbo.columns.getColumnAt 1
            page = tree.view.getCellText(row.value, urlcolumn)
            @addTab page
        catch error
            return

    addTab: (url) -> @gBrowser.addTab url

    makeRequest: (url, callback) ->
        uri = @ioService.newURI url, null, null
        channel = @ioService.newChannelFromURI uri
        listener = new StreamListener channel, callback
        domain = url.split('/')[2]
        unless @visitedDomains.include domain
            @visitedDomains.add domain
            channel.asyncOpen listener, null
            return
        setTimeout((-> channel.asyncOpen listener, null), @politeTimeout())
        return

    # Don't want users to get blocked for spamming sites. Google, in particular,
    # is quite sensitive.
    politeTimeout: -> 10000

    _stripHtml: (text) -> text.replace /<.*?>/g, ''


    _executeSearchQuery: (query, fn) ->
        db = Components.classes['@mozilla.org/browser/nav-history-service;1']
            .getService(Components.interfaces.nsPIPlacesDatabase).DBConnection
        sql_stmt = db.createStatement query
        sql_stmt.executeAsync @resultHandler fn


    resultHandler: (fn) ->
        handler =
            handleResult: (aResultSet) =>
                row = aResultSet.getNextRow()
                while row
                    fn @normalizeRow row
                    row = aResultSet.getNextRow()

            handleError: (aError) -> alert "Error: " + aError.message

            handleCompletion: (aReason) =>
                @hideIndicator()
                alert "Query canceled or aborted!" unless @queryFinishedOk aReason
        return handler

    showIndicator: -> @asyncCounter.inc()

    hideIndicator: -> @asyncCounter.dec()


    normalizeRow: (row) ->
        ret = {}
        for attr in ['title', 'url', 'visit_count', 'last_visit_date']
            ret[attr] = row.getResultByName(attr)
        return ret

    queryFinishedOk: (reason)->
        reason == Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED


window.PowerHistory = new PowerHistoryClass()
