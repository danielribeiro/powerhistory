var PowerHistory = {
    val: 0,

    onCommand: function(event) {
        dump("Hello world!\n");
        window.openDialog("chrome://powerhistory/content/pwdialog.xul", "_blank", "chrome,all,dialog=no");
    },

    changeme: function(event) {
    },

    showhistory: function() {
        var historyService = Components.classes["@mozilla.org/browser/nav-history-service;1"]
        .getService(Components.interfaces.nsINavHistoryService);
        var query = historyService.getNewQuery();
        var options = historyService.getNewQueryOptions();
        options.sortingMode = options.SORT_BY_VISITCOUNT_DESCENDING;
        options.maxResults = 10;

        // execute the query
        var result = historyService.executeQuery(query, options);

        // iterate over the results
        result.root.containerOpen = true;
        var count = result.root.childCount;
        for (var i = 0; i < count; i++) {
            var node = result.root.getChild(i);
            dump("title is " + node.title)
            dump("url is " + node.uri)
        }

        result.root.containerOpen = false;

    },

    init: function() {
        var newone = document.createElement("description")
        newone.textContent = "a content"
        document.getElementById("central").appendChild(newone)
    }
};
