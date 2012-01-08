/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($) {

    Umbraco.Editors.Dashboards = function() {
    
        var _opts = null;
        var cookieId = null;

        //view model for knockout js
        var dashboardViewModel = {
            hide: function() {
                $.cookies.set(cookieId, "hidden", { expiresAt: new Date(2050, 1, 1) });
                this.show(false);
            },
            show: ko.observable(true)
        };

        return {
            init: function(o) {

                _opts = o;
                cookieId = "dash_" + MD5(_opts.userId + _opts.dashboardSelector.attr("id"));

                //update the view model based on the cookie val
                var c = $.cookies.get(cookieId);
                if (!c || c != "hidden")
                    dashboardViewModel.show(true);
                else
                    dashboardViewModel.show(false);


                //apply knockout js bindings
                ko.applyBindings(dashboardViewModel, _opts.dashboardSelector.get(0));
            }
        };

    }(); //singleton

})(jQuery);