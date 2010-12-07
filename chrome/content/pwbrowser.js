(function() {
  var $, PowerHistory, _i, _len, _ref, _xul_list, ui;
  var __hasProp = Object.prototype.hasOwnProperty;
  ui = {};
  _xul_list = ['action', 'arrowscrollbox', 'assign', 'bbox', 'binding', 'bindings', 'box', 'broadcaster', 'broadcasterset', 'button', 'browser', 'checkbox', 'caption', 'colorpicker', 'column', 'columns', 'commandset', 'command', 'conditions', 'content', 'datepicker', 'deck', 'description', 'dialog', 'dialogheader', 'dropmarker', 'editor', 'grid', 'grippy', 'groupbox', 'hbox', 'iframe', 'image', 'key', 'keyset', 'label', 'listbox', 'listcell', 'listcol', 'listcols', 'listhead', 'listheader', 'listitem', 'member', 'menu', 'menubar', 'menuitem', 'menulist', 'menupopup', 'menuseparator', 'notification', 'notificationbox', 'observes', 'overlay', 'page', 'panel', 'param', 'popupset', 'preference', 'preferences', 'prefpane', 'prefwindow', 'progressmeter', 'query', 'queryset', 'radio', 'radiogroup', 'resizer', 'richlistbox', 'richlistitem', 'row', 'rows', 'rule', 'scale', 'script', 'scrollbar', 'scrollbox', 'scrollcorner', 'separator', 'spacer', 'spinbuttons', 'splitter', 'stack', 'statusbar', 'statusbarpanel', 'stringbundle', 'stringbundleset', 'tab', 'tabbrowser', 'tabbox', 'tabpanel', 'tabpanels', 'tabs', 'template', 'textnode', 'textbox', 'timepicker', 'titlebar', 'toolbar', 'toolbarbutton', 'toolbargrippy', 'toolbaritem', 'toolbarpalette', 'toolbarseparator', 'toolbarset', 'toolbarspacer', 'toolbarspring', 'toolbox', 'tooltip', 'tree', 'treecell', 'treechildren', 'treecol', 'treecols', 'treeitem', 'treerow', 'treeseparator', 'triple', 'vbox', 'where', 'window', 'wizard', 'wizardpage'];
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
        ret.add = function(args) {
          var _j, _len2, _ref3, i;
          _ref3 = args;
          for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
            i = _ref3[_j];
            ret.appendChild(i);
          }
          return ret;
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
      var b, i1, i2, menu, newone;
      newone = ui.description().text("a content");
      $("central").appendChild(newone);
      b = ui.button({
        type: 'menu',
        label: 'Cofmenu'
      });
      $('pwbox').appendChild(b);
      menu = ui.menupopup();
      i1 = ui.menuitem();
      i1.setAttribute('label', 'item1');
      i2 = ui.menuitem();
      i2.setAttribute('label', 'item2');
      menu.appendChild(i1);
      menu.appendChild(i2);
      return b.appendChild(menu);
    }
  };
window.$ = $
window.PowerHistory = PowerHistory
window._i = _i
window._len = _len
window._ref = _ref
window._xul_list = _xul_list
window.ui = ui
}).call(this);
