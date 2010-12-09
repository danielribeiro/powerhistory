(function() {
  var $, CallbackStorage, PowerHistoryClass, StreamListener, _addAllTo, _i, _len, _ref, _xul_list, addTo, dumpobj, ui;
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
    if (aIID.equals(Components.interfaces.nsISupports) || aIID.equals(Components.interfaces.nsIInterfaceRequestor) || aIID.equals(Components.interfaces.nsIChannelEventSink) || aIID.equals(Components.interfaces.nsIProgressEventSink) || aIID.equals(Components.interfaces.nsIHttpEventSink) || aIID.equals(Components.interfaces.nsIStreamListener)) {
      return this;
    }
    throw Components.results.NS_NOINTERFACE;
  };
  PowerHistoryClass = function() {
    this.searchinput = ui.textbox();
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
    this.toggler = ui.checkbox({
      label: "Limit by Date"
    }).xcommand(__bind(function() {
      var _j, _len2, _ref2, _result, datePicker;
      _result = []; _ref2 = [this.to, this.from];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        datePicker = _ref2[_j];
        _result.push(datePicker.setAttribute('disabled', !this.toggler.checked));
      }
      return _result;
    }, this));
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
  PowerHistoryClass.prototype.onLoad = function() {
    var dataRange, searchBox, searchMenu;
    searchMenu = ui.box({
      align: 'center'
    }).add(this.searchinput, ui.button({
      label: 'Search '
    }).xcommand(__bind(function() {
      return this.search();
    }, this)), ui.checkbox({
      label: "Search Inside Page's content"
    }));
    dataRange = ui.box().add(this.text('From:'), this.from, this.text('To:'), this.to, this.toggler);
    searchBox = ui.vbox().add(ui.spacer({
      height: '15'
    }), this.text('Power History'), searchMenu, ui.spacer({
      height: '15'
    }), dataRange);
    return addTo('pwwindow', searchBox, this.createContent());
  };
  PowerHistoryClass.prototype.addToContent = function(row) {
    var _j, _len2, _ref2, i, newRow;
    newRow = ui.treerow();
    _ref2 = row;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      i = _ref2[_j];
      newRow.add(ui.treecell({
        label: i
      }));
    }
    return this.content.add(ui.treeitem().add(newRow));
  };
  PowerHistoryClass.prototype.createContent = function() {
    var _j, _len2, _ref2, column, columns;
    columns = ui.treecols();
    _ref2 = ['Title', 'Url', 'How many times visited', 'Last visited'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      column = _ref2[_j];
      columns.add(ui.treecol({
        label: column,
        flex: 1
      }));
    }
    this.contentList.add(columns, this.content);
    return this.contentList;
  };
  PowerHistoryClass.prototype.searchHistory = function(queryString) {
    var _ref2, _result, count, historyService, i, options, query, result, ret;
    historyService = Components.classes["@mozilla.org/browser/nav-history-service;1"].getService(Components.interfaces.nsINavHistoryService);
    query = historyService.getNewQuery();
    query.searchTerms = queryString;
    query.includeHidden = true;
    options = historyService.getNewQueryOptions();
    options.sortingMode = options.SORT_BY_VISITCOUNT_DESCENDING;
    result = historyService.executeQuery(query, options);
    result.root.containerOpen = true;
    count = result.root.childCount;
    ret = (function() {
      _result = []; _ref2 = (count - 1);
      for (i = 0; (0 <= _ref2 ? i <= _ref2 : i >= _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
        _result.push(result.root.getChild(i));
      }
      return _result;
    })();
    result.root.containerOpen = false;
    return ret;
  };
  PowerHistoryClass.prototype.search = function() {
    var _j, _len2, _ref2, _result, i, regex;
    if (this.searchinput.value.trim() === '') {
      return null;
    }
    regex = new RegExp(this.searchinput.value, 'i');
    _result = []; _ref2 = this.searchHistory(this.searchinput.value);
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      i = _ref2[_j];
      _result.push(this.addToContent(this.getFrom(i, 'title', 'uri', 'accessCount', 'time')));
    }
    return _result;
  };
  PowerHistoryClass.prototype.onClick = function(event) {
    var cellText, col, firstcol, row, tbo, tree;
    tree = this.contentList;
    tbo = tree.treeBoxObject;
    row = {};
    col = {};
    tbo.getCellAt(event.clientX, event.clientY, row, col, {});
    try {
      firstcol = tbo.columns.getColumnAt(0);
      cellText = tree.view.getCellText(row.value, firstcol);
      return alert("the text=" + (cellText) + " row = " + (row.value) + " col = " + (col.value));
    } catch (error) {
      return null;
    }
  };
  PowerHistoryClass.prototype.getFrom = function(obj) {
    var _j, _len2, _ref2, _result, arg, args;
    args = __slice.call(arguments, 1);
    _result = []; _ref2 = args;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      arg = _ref2[_j];
      _result.push(obj[arg]);
    }
    return _result;
  };
  PowerHistoryClass.prototype.makeRequest = function(url, callback) {
    var channel, ioService, listener, uri;
    ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
    uri = ioService.newURI(url, null, null);
    channel = ioService.newChannelFromURI(uri);
    listener = new StreamListener(channel, callback);
    return channel.asyncOpen(listener, null);
  };
  PowerHistoryClass.prototype.searchWithin = function(url, regex) {
    return this.makeRequest(url, __bind(function(data) {
      return data.search(regex) >= 0 ? this.addResult(url) : this.noResultFor(url);
    }, this));
  };
  PowerHistoryClass.prototype.addResult = function(url) {
    return this.addToContent(['title', url, 'accessCount', 'time']);
  };
  PowerHistoryClass.prototype.noResultFor = function(url) {
    return null;
  };
  PowerHistoryClass.prototype.stripHtml = function(text) {
    return text.replace(/<.*?>/g, '');
  };
  this.PowerHistory = new PowerHistoryClass();
}).call(this);
