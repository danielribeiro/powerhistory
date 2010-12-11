(function() {
  var $, AsyncCounter, CallbackStorage, KEY_ENTER, PowerHistoryClass, Set, StreamListener, _addAllTo, _i, _len, _ref, _xul_list, addTo, dumpobj, ui;
  var __hasProp = Object.prototype.hasOwnProperty, __slice = Array.prototype.slice, __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  ui = {};
  _xul_list = ['action', 'arrowscrollbox', 'assign', 'bbox', 'binding', 'bindings', 'box', 'broadcaster', 'broadcasterset', 'button', 'browser', 'checkbox', 'caption', 'colorpicker', 'column', 'columns', 'commandset', 'command', 'conditions', 'content', 'datepicker', 'deck', 'description', 'dialog', 'dialogheader', 'dropmarker', 'editor', 'grid', 'grippy', 'groupbox', 'hbox', 'iframe', 'image', 'key', 'keyset', 'label', 'listbox', 'listcell', 'listcol', 'listcols', 'listhead', 'listheader', 'listitem', 'member', 'menu', 'menubar', 'menuitem', 'menulist', 'menupopup', 'menuseparator', 'notification', 'notificationbox', 'observes', 'overlay', 'page', 'panel', 'param', 'popupset', 'preference', 'preferences', 'prefpane', 'prefwindow', 'progressmeter', 'query', 'queryset', 'radio', 'radiogroup', 'resizer', 'richlistbox', 'richlistitem', 'row', 'rows', 'rule', 'scale', 'script', 'scrollbar', 'scrollbox', 'scrollcorner', 'separator', 'spacer', 'spinbuttons', 'splitter', 'stack', 'statusbar', 'statusbarpanel', 'stringbundle', 'stringbundleset', 'tab', 'tabbrowser', 'tabbox', 'tabpanel', 'tabpanels', 'tabs', 'template', 'textnode', 'textbox', 'timepicker', 'titlebar', 'toolbar', 'toolbarbutton', 'toolbargrippy', 'toolbaritem', 'toolbarpalette', 'toolbarseparator', 'toolbarset', 'toolbarspacer', 'toolbarspring', 'toolbox', 'tooltip', 'tree', 'treecell', 'treechildren', 'treecol', 'treecols', 'treeitem', 'treerow', 'treeseparator', 'triple', 'vbox', 'where', 'window', 'wizard', 'wizardpage'];
  _addAllTo = function(target, args) {
    var _i, _len, _ref, i;
    _ref = args;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      target.appendChild(i);
    }
    return target;
  };
  dumpobj = function(obj) {
    var _len, _ref, _result, k, ret, v;
    ret = (function() {
      _result = []; _ref = obj;
      for (v = 0, _len = _ref.length; v < _len; v++) {
        k = _ref[v];
        _result.push("" + (k) + " = " + (v.toString()));
      }
      return _result;
    })();
    return ret.join(", ");
  };
  CallbackStorage = function() {
    this.counter = 0;
    return this;
  };
  CallbackStorage.prototype.addFunction = function(f) {
    var body, mname;
    mname = ("_innerFunction" + (this.counter));
    body = ("_Callbacks." + (mname) + "(event);");
    this.counter++;
    this[mname] = f;
    return body;
  };
  this._Callbacks = new CallbackStorage();
  _ref = _xul_list;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    (function() {
      var element = _ref[_i];
      return (ui[element] = function(atr) {
        var _ref2, k, ret, v;
        ret = document.createElement(element);
        if (typeof atr !== "undefined" && atr !== null) {
          _ref2 = atr;
          for (k in _ref2) {
            if (!__hasProp.call(_ref2, k)) continue;
            v = _ref2[k];
            ret.setAttribute(k, v);
          }
        }
        ret.add = function() {
          var args;
          args = __slice.call(arguments, 0);
          return _addAllTo(ret, args);
        };
        ret.text = function(args) {
          if (!(typeof args !== "undefined" && args !== null)) {
            return ret.textContent;
          }
          ret.textContent = args;
          return ret;
        };
        ret.xclick = function(func) {
          ret.setAttribute('onclick', _Callbacks.addFunction(func));
          return ret;
        };
        ret.xcommand = function(func) {
          ret.setAttribute('oncommand', _Callbacks.addFunction(func));
          return ret;
        };
        return ret;
      });
    })();
  }
  $ = function(name) {
    return document.getElementById(name);
  };
  addTo = function(name) {
    var args;
    args = __slice.call(arguments, 1);
    return _addAllTo($(name), args);
  };
  StreamListener = function(_arg, _arg2) {
    this.mCallbackFunc = _arg2;
    this.channel = _arg;
    return this;
  };
  StreamListener.prototype.mData = "";
  StreamListener.prototype.onStartRequest = function(aRequest, aContext) {
    return (this.mData = "");
  };
  StreamListener.prototype.onDataAvailable = function(aRequest, aContext, aStream, aSourceOffset, aLength) {
    var scriptableInputStream;
    scriptableInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
    scriptableInputStream.init(aStream);
    return this.mData += scriptableInputStream.read(aLength);
  };
  StreamListener.prototype.onStopRequest = function(aRequest, aContext, aStatus) {
    if (Components.isSuccessCode(aStatus)) {
      this.mCallbackFunc(this.mData);
    } else {
      this.mCallbackFunc(null);
    }
    return (this.channel = null);
  };
  StreamListener.prototype.onChannelRedirect = function(aOldChannel, aNewChannel, aFlags) {
    return (this.channel = aNewChannel);
  };
  StreamListener.prototype.getInterface = function(aIID) {
    try {
      return this.queryInterface(aIID);
    } catch (e) {
      throw Components.results.NS_NOINTERFACE;
    }
  };
  StreamListener.prototype.onProgress = function(aRequest, aContext, aProgress, aProgressMax) {
    return null;
  };
  StreamListener.prototype.onStatus = function(aRequest, aContext, aStatus, aStatusArg) {
    return null;
  };
  StreamListener.prototype.onRedirect = function(aOldChannel, aNewChannel) {
    return null;
  };
  StreamListener.prototype.queryInterface = function(aIID) {
    var ns;
    ns = Components.interfaces;
    if (aIID.equals(ns.nsISupports) || aIID.equals(ns.nsIInterfaceRequestor) || aIID.equals(ns.nsIChannelEventSink) || aIID.equals(ns.nsIProgressEventSink) || aIID.equals(ns.nsIHttpEventSink) || aIID.equals(ns.nsIStreamListener)) {
      return this;
    }
    throw Components.results.NS_NOINTERFACE;
  };
  AsyncCounter = function() {
    var loadingUrl;
    this.counterDisplay = ui.description({
      collapsed: true
    }).text("(1/1)");
    loadingUrl = "chrome://global/skin/icons/loading_16.png";
    this.searchingIndicator = ui.box({
      collapsed: true
    }).add(ui.image({
      src: loadingUrl,
      maxwidth: 16,
      maxheight: 16
    }), this.counterDisplay, ui.description({
      style: "font: 1.2em bold;"
    }).text("Searching..."));
    this.reset();
    return this;
  };
  AsyncCounter.prototype.reset = function() {
    this.current = 0;
    this.total = 0;
    this.done = 0;
    return (this.counterDisplay.collapsed = true);
  };
  AsyncCounter.prototype.display = function() {
    return this.searchingIndicator;
  };
  AsyncCounter.prototype.isDone = function() {
    return this.current === 0;
  };
  AsyncCounter.prototype.updateDisplay = function() {
    if (this.total <= 1) {
      return null;
    }
    this.counterDisplay.textContent = ("(" + (this.done) + "/" + (this.total) + ")");
    return (this.counterDisplay.collapsed = false);
  };
  AsyncCounter.prototype.inc = function() {
    this.total++;
    this.current++;
    this.updateDisplay();
    return (this.searchingIndicator.collapsed = false);
  };
  AsyncCounter.prototype.dec = function() {
    this.done++;
    this.current--;
    this.updateDisplay();
    if (this.isDone()) {
      return (this.searchingIndicator.collapsed = true);
    }
  };
  Set = function(array) {
    var _j, _len2, _ref2, i;
    this.data = {};
    if (typeof array !== "undefined" && array !== null) {
      _ref2 = array;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        i = _ref2[_j];
        this.add(i);
      }
    }
    return this;
  };
  Set.prototype.add = function(o) {
    return (this.data[o] = o);
  };
  Set.prototype.remove = function(o) {
    return delete this.data[o];
  };
  Set.prototype.include = function(o) {
    var _ref2;
    return (typeof (_ref2 = this.data[o]) !== "undefined" && _ref2 !== null);
  };
  Set.prototype.each = function(fn) {
    var _ref2, k, v;
    _ref2 = this.data;
    for (k in _ref2) {
      if (!__hasProp.call(_ref2, k)) continue;
      v = _ref2[k];
      fn(v);
    }
    return null;
  };
  Set.prototype.empty = function() {
    var _j, _ref2, k;
    _ref2 = this.data;
    for (k in _ref2) {
      if (!__hasProp.call(_ref2, k)) continue;
      _j = _ref2[k];
      return false;
    }
    return true;
  };
  KEY_ENTER = 13;
  PowerHistoryClass = function() {
    this.visitedDomains = new Set();
    this.asyncCounter = new AsyncCounter();
    this.searchinput = ui.textbox();
    this.searchinput.addEventListener('keypress', __bind(function(e) {
      return this.handleKey(e);
    }, this), true);
    this.content = ui.treechildren();
    this.contentList = ui.tree({
      hidecolumnpicker: true,
      flex: 1,
      seltype: 'single'
    }).xclick(__bind(function(e) {
      return this.onClick(e);
    }, this));
    this.to = this.datepicker();
    this.from = this.datepicker();
    this.withinDate = ui.checkbox({
      label: "Limit by Date"
    }).xcommand(__bind(function() {
      var _j, _len2, _ref2, _result, datePicker;
      _result = []; _ref2 = [this.to, this.from];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        datePicker = _ref2[_j];
        _result.push(datePicker.setAttribute('disabled', !this.withinDate.checked));
      }
      return _result;
    }, this));
    this.gBrowser = this.constructGBrowser();
    this.searchWithinBox = ui.checkbox({
      label: "Search Inside Page's content"
    });
    this.ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
    return this;
  };
  PowerHistoryClass.prototype.text = function(label) {
    return ui.description().text(label);
  };
  PowerHistoryClass.prototype.datepicker = function() {
    return ui.datepicker({
      type: 'popup',
      disabled: true
    });
  };
  PowerHistoryClass.prototype.handleKey = function(event) {
    if (event.keyCode === KEY_ENTER) {
      return this.search();
    }
  };
  PowerHistoryClass.prototype.constructGBrowser = function() {
    return window.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebNavigation).QueryInterface(Components.interfaces.nsIDocShellTreeItem).rootTreeItem.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow).gBrowser;
  };
  PowerHistoryClass.prototype.onLoad = function() {
    var dataRange, menu, metaSearch, searchBox, searchMenu;
    searchMenu = ui.box().add(this.searchinput, ui.button({
      label: 'Search '
    }).xcommand(__bind(function() {
      return this.search();
    }, this)), this.searchWithinBox);
    dataRange = ui.box().add(this.text('From:'), this.from, this.text('To:'), this.to, this.withinDate);
    searchBox = ui.vbox().add(ui.spacer({
      height: '15'
    }), this.text('Power History'), searchMenu, ui.spacer({
      height: '15'
    }), dataRange);
    metaSearch = ui.vbox().add(ui.spacer({
      height: '15'
    }), this.asyncCounter.display());
    menu = ui.box().add(searchBox, metaSearch);
    return addTo('pwwindow', menu, this.createContent());
  };
  PowerHistoryClass.prototype.clearContent = function() {
    this.visitedDomains = new Set();
    this.asyncCounter.reset();
    while (this.content.hasChildNodes()) {
      this.content.removeChild(this.content.firstChild);
    }
    return null;
  };
  PowerHistoryClass.prototype.addToContent = function(i) {
    var _j, _len2, _ref2, newRow, value;
    newRow = ui.treerow();
    _ref2 = [i.title, i.url, i.visit_count, new Date(i.last_visit_date / 1000)];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      value = _ref2[_j];
      newRow.add(ui.treecell({
        label: value
      }));
    }
    this.content.add(ui.treeitem().add(newRow));
    return null;
  };
  PowerHistoryClass.prototype.createContent = function() {
    var _ref2, column, columns, size;
    columns = ui.treecols();
    _ref2 = {
      Title: 40,
      Url: 40,
      'Visit #': 1,
      'Last visited': 25
    };
    for (column in _ref2) {
      if (!__hasProp.call(_ref2, column)) continue;
      size = _ref2[column];
      columns.add(ui.treecol({
        label: column,
        flex: size,
        fixed: false
      }));
      if (column !== 'Last visited') {
        columns.add(ui.splitter({
          width: 0
        }));
      }
    }
    this.contentList.add(columns, this.content);
    return this.contentList;
  };
  PowerHistoryClass.prototype.search = function() {
    var value;
    value = this.searchinput.value.trim();
    if (value === '') {
      return null;
    }
    this.clearContent();
    this.showIndicator();
    return this.searchHistory(value.split(/\s+/));
  };
  PowerHistoryClass.prototype.searchHistory = function(words) {
    if (this.searchWithinBox.checked) {
      return this.withinSearchHistory(words);
    }
    return this.basicSearchHistory(words);
  };
  PowerHistoryClass.prototype.confirmBigData = function() {
    var check, info, prompts, result;
    prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    check = {
      value: true
    };
    info = "This query may take a long time.";
    return (result = prompts.confirmCheck(null, info, "Are you sure?", "Don't ask again", check));
  };
  PowerHistoryClass.prototype.withinSearchHistory = function(words, fn) {
    var _j, _len2, _ref2, _result, query, regexes, word;
    if (!(this.withinDate.checked)) {
      if (!(this.confirmBigData())) {
        this.hideIndicator();
        return null;
      }
    }
    regexes = (function() {
      _result = []; _ref2 = words;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        word = _ref2[_j];
        _result.push(new RegExp(word, 'i'));
      }
      return _result;
    })();
    query = ("SELECT url, title, visit_count, last_visit_date FROM moz_places\
        where url like 'http:%' " + (this._datePart()) + " order by last_visit_date\
        desc limit");
    return this._executeSearchQuery(query, __bind(function(row) {
      return this.searchForAllWithin(row, regexes);
    }, this));
  };
  PowerHistoryClass.prototype.searchForAllWithin = function(i, regexes) {
    var missingRegexes;
    missingRegexes = new Set(regexes);
    this.matchesOn(i.title, missingRegexes);
    this.matchesOn(i.url, missingRegexes);
    if (missingRegexes.empty()) {
      return this.addToContent(i);
    }
    this.showIndicator();
    return this.makeRequest(i.url, __bind(function(data) {
      this.matchesOn(this._stripHtml(data), missingRegexes, i.url);
      if (missingRegexes.empty()) {
        this.addToContent(i);
      }
      return this.hideIndicator();
    }, this));
  };
  PowerHistoryClass.prototype.matchesOn = function(str, patternSet) {
    patternSet.each(function(pattern) {
      if (str.search(pattern) >= 0) {
        return patternSet.remove(pattern);
      }
    });
    return null;
  };
  PowerHistoryClass.prototype.basicSearchHistory = function(words) {
    var _j, _len2, _ref2, _result, likeParts, likeQuery, query, w;
    likeParts = (function() {
      _result = []; _ref2 = words;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        w = _ref2[_j];
        _result.push(this.urlOrTitleHas(w));
      }
      return _result;
    }).call(this);
    likeQuery = likeParts.join(' AND ');
    query = ("SELECT url, title, visit_count, last_visit_date FROM moz_places\
        where url like 'http:%' AND (" + (likeQuery) + ") " + (this._datePart()) + " order by last_visit_date\
        desc");
    return this._executeSearchQuery(query, __bind(function(i) {
      return this.addToContent(i);
    }, this));
  };
  PowerHistoryClass.prototype._datePart = function() {
    var fromDate, toDate;
    if (!(this.withinDate.checked)) {
      return "";
    }
    fromDate = this.from.dateValue.valueOf() * 1000;
    toDate = this.to.dateValue.valueOf() * 1000;
    return ("AND (last_visit_date BETWEEN " + (fromDate) + " AND " + (toDate) + ")");
  };
  PowerHistoryClass.prototype._likePart = function(col, value) {
    return "(" + (col) + " LIKE '%" + (value) + "%')";
  };
  PowerHistoryClass.prototype.urlOrTitleHas = function(w) {
    return '(' + this._likePart('url', w) + ' OR ' + this._likePart('title', w) + ')';
  };
  PowerHistoryClass.prototype.onClick = function(event) {
    var col, page, row, tbo, tree, urlcolumn;
    tree = this.contentList;
    tbo = tree.treeBoxObject;
    row = {};
    col = {};
    tbo.getCellAt(event.clientX, event.clientY, row, col, {});
    try {
      urlcolumn = tbo.columns.getColumnAt(1);
      page = tree.view.getCellText(row.value, urlcolumn);
      return this.addTab(page);
    } catch (error) {
      return null;
    }
  };
  PowerHistoryClass.prototype.addTab = function(url) {
    return this.gBrowser.addTab(url);
  };
  PowerHistoryClass.prototype.makeRequest = function(url, callback) {
    var channel, domain, listener, uri;
    uri = this.ioService.newURI(url, null, null);
    channel = this.ioService.newChannelFromURI(uri);
    listener = new StreamListener(channel, callback);
    domain = url.split('/')[2];
    if (!(this.visitedDomains.include(domain))) {
      this.visitedDomains.add(domain);
      channel.asyncOpen(listener, null);
      return null;
    }
    setTimeout(function() {
      return channel.asyncOpen(listener, null);
    }, this.politeTimeout());
    return null;
  };
  PowerHistoryClass.prototype.politeTimeout = function() {
    return 10000;
  };
  PowerHistoryClass.prototype._stripHtml = function(text) {
    return text.replace(/<.*?>/g, '');
  };
  PowerHistoryClass.prototype._executeSearchQuery = function(query, fn) {
    var db, sql_stmt;
    db = Components.classes['@mozilla.org/browser/nav-history-service;1'].getService(Components.interfaces.nsPIPlacesDatabase).DBConnection;
    sql_stmt = db.createStatement(query);
    return sql_stmt.executeAsync(this.resultHandler(fn));
  };
  PowerHistoryClass.prototype.resultHandler = function(fn) {
    var handler;
    handler = {
      handleResult: __bind(function(aResultSet) {
        var _result, row;
        row = aResultSet.getNextRow();
        _result = [];
        while (row) {
          _result.push((function() {
            fn(this.normalizeRow(row));
            return (row = aResultSet.getNextRow());
          }).call(this));
        }
        return _result;
      }, this),
      handleError: function(aError) {
        return alert("Error: " + aError.message);
      },
      handleCompletion: __bind(function(aReason) {
        this.hideIndicator();
        if (!(this.queryFinishedOk(aReason))) {
          return alert("Query canceled or aborted!");
        }
      }, this)
    };
    return handler;
  };
  PowerHistoryClass.prototype.showIndicator = function() {
    return this.asyncCounter.inc();
  };
  PowerHistoryClass.prototype.hideIndicator = function() {
    return this.asyncCounter.dec();
  };
  PowerHistoryClass.prototype.normalizeRow = function(row) {
    var _j, _len2, _ref2, attr, ret;
    ret = {};
    _ref2 = ['title', 'url', 'visit_count', 'last_visit_date'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      attr = _ref2[_j];
      ret[attr] = row.getResultByName(attr);
    }
    return ret;
  };
  PowerHistoryClass.prototype.queryFinishedOk = function(reason) {
    return reason === Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED;
  };
  this.PowerHistory = new PowerHistoryClass();
}).call(this);
