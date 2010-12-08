(function() {
  var $, PowerHistoryClass, _addAllTo, _i, _len, _ref, _xul_list, addTo, dumpobj, ui;
  var __hasProp = Object.prototype.hasOwnProperty, __slice = Array.prototype.slice;
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
  PowerHistoryClass = function() {
    this.searchinput = ui.textbox();
    this.content = ui.treechildren();
    this.contentList = ui.tree({
      hidecolumnpicker: true,
      flex: 1,
      onclick: "PowerHistory.onClick(event)",
      seltype: 'single'
    });
    return this;
  };
  PowerHistoryClass.prototype.onCommand = function() {
    dump("commaneded world!\n");
    return window.openDialog("chrome://powerhistory/content/pwdialog.xul", "_blank", "chrome,all,dialog=no");
  };
  PowerHistoryClass.prototype.onLoad = function() {
    var searchbox;
    dump('loaded');
    searchbox = ui.box({
      align: 'center'
    }).add(ui.description({
      flex: '1'
    }).text('My description'), this.searchinput, ui.button({
      label: 'Search ',
      oncommand: "PowerHistory.search();"
    }));
    return addTo('pwwindow', searchbox, this.createContent());
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
    _ref2 = ['Title', 'Icon', 'Url', 'How many times visited', 'Last visited'];
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
  PowerHistoryClass.prototype.showhistory = function() {
    var _ref2, _result, count, historyService, i, options, query, result, ret;
    historyService = Components.classes["@mozilla.org/browser/nav-history-service;1"].getService(Components.interfaces.nsINavHistoryService);
    query = historyService.getNewQuery();
    query.searchTerms = this.searchinput.value;
    options = historyService.getNewQueryOptions();
    options.sortingMode = options.SORT_BY_VISITCOUNT_DESCENDING;
    options.maxResults = 10;
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
    var _j, _len2, _ref2, _result, i;
    _result = []; _ref2 = this.showhistory();
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      i = _ref2[_j];
      _result.push(this.addToContent(this.getFrom(i, 'title', 'icon', 'uri', 'accessCount', 'time')));
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
      return alert('sorry');
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
  this.PowerHistory = new PowerHistoryClass();
}).call(this);
