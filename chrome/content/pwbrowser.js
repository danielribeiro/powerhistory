(function() {
  var $, PowerHistory, _addAllTo, _i, _len, _ref, _xul_list, addTo, ui;
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
        ret.addTo = function(id) {
          return $(id).appendChild(ret);
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
  PowerHistory = {
    val: 0,
    onCommand: function() {
      dump("commaneded world!\n");
      return window.openDialog("chrome://powerhistory/content/pwdialog.xul", "_blank", "chrome,all,dialog=no");
    },
    onLoad: function() {
      return dump('loaded');
    },
    showhistory: function() {
      var _ref2, count, historyService, i, node, options, query, result;
      historyService = Components.classes["@mozilla.org/browser/nav-history-service;1"].getService(Components.interfaces.nsINavHistoryService);
      query = historyService.getNewQuery();
      options = historyService.getNewQueryOptions();
      options.sortingMode = options.SORT_BY_VISITCOUNT_DESCENDING;
      options.maxResults = 10;
      result = historyService.executeQuery(query, options);
      result.root.containerOpen = true;
      count = result.root.childCount;
      _ref2 = (count - 1);
      for (i = 0; (0 <= _ref2 ? i <= _ref2 : i >= _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
        node = result.root.getChild(i);
        dump("title is " + node.title);
        dump("url is " + node.uri);
      }
      return (result.root.containerOpen = false);
    },
    init: function() {
      var menu;
      ui.description().text("a content").addTo('central');
      menu = ui.menupopup().add(ui.menuitem({
        label: 'item1'
      }), ui.menuitem({
        label: 'item2'
      }));
      return ui.button({
        type: 'menu',
        label: 'Cofmenu'
      }).add(menu).addTo('pwbox');
    }
  };
window.$ = $
window.PowerHistory = PowerHistory
window._addAllTo = _addAllTo
window._i = _i
window._len = _len
window._ref = _ref
window._xul_list = _xul_list
window.addTo = addTo
window.ui = ui
}).call(this);
