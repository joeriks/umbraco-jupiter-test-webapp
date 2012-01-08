(function ($) {

    $.fn.umbracoTabs = function (o) {

        var _opts = $.extend({
            //a jquery selector for the container of the tabs
            content: null,
            //A jquery selector for a hidden field (or any input with a val() ) to track the active tab index
            activeTabIndexField: false,
            //A callback fired when the tab index has changed, passes in an args parameter with an 'activeIndex' property
            onTabChange: false,
            //the initial active tab index to be displayed
            activeTabIndex: 0
        }, o);

        return this.each(function () {
            //create the tabs
            var tabContent = $(_opts.content).children("div");
            //add the class
            tabContent.each(function () {
                $(this).hide();
                $(this).addClass("tab-content");
            });
            var $liList = $(this).find("li");
            $(this).addClass("umb-tabs");
            $liList.addClass("tab");

            var activateTab = function ($tabLink) {
                var $currLi = $tabLink.closest("li");
                var index = $liList.index($currLi);
                //show the panel for the given index
                tabContent.filter(":visible").hide().end().eq(index).show();
                //update the tabs
                $liList.removeClass("tab-on");
                $currLi.addClass("tab-on");
                if ($.isFunction(_opts.onTabChange)) {
                    _opts.onTabChange.apply($tabLink, [{ activeIndex: index}]);
                }
                if (_opts.activeTabIndexField) {
                    $(_opts.activeTabIndexField).val(index);
                }
            }

            //bind the click handler
            $liList.find("a").click(function () {
                activateTab($(this));
            });

            //set the active tab index
            activateTab($liList.eq(_opts.activeTabIndex).find("a"));
            
        });
    }



})(jQuery);