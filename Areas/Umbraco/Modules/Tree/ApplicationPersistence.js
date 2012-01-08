/// <reference path="/Areas/Umbraco/Scripts/Modernizr/modernizr.js" />

//A plugin used to persist tree applications data so that when navigating between applications in Umbraco, the tree's state is maintained.

(function ($) {

    $.jstree.plugin("applicationpersistence", {

        __init: function () {
            this.get_container()
                .bind("load_node.jstree", $.proxy(function (e, data) {
                    //need to check if this node is in our selected nodes list, if so, do the selection
                    var appId = data.inst._getCurrentAppId();
                    if (appId) {
                        var appState = data.inst.getApplicationState(appId);
                        if (appState && appState.selectedNodes) {
                            for (var n in appState.selectedNodes) {
                                data.inst.select_node(data.inst.get_container().find("#" + appState.selectedNodes[n]), true);
                            }
                        }
                    }
                }))
                .bind("before.jstree", $.proxy(function (e, data) {
                    //before destroying the tree, lets save the data
                    var settings, appId;
                    if (data.func === "destroy") {
                        appId = this._getCurrentAppId();
                        if (appId) {
                            this.saveApplicationState(appId);
                        }
                    }
                    else if (data.func === "load_node" && data.args && data.args.length && data.args.length > 0 && data.args[0] == -1) {
                        //if we're loading the root node, check if we have persisted data for the app id                        
                        settings = this.get_settings();
                        appId = this._getCurrentAppId();
                        if (appId && !settings.json_data.data) {
                            var appState = this.getApplicationState(appId);
                            if (appState && appState.nodeData) {
                                //set the initial 'data' for the json_data plugin
                                settings.json_data.data = appState.nodeData;
                            }
                            this._set_settings(settings);
                        }
                    }
                }, this))
                .bind("init.jstree", $.proxy(function (e, data) {

                }, this));
        },
        defaults: {
        },
        _fn: {
            _getCurrentAppId: function () {
                var settings = this.get_settings();
                if (settings && settings.json_data && settings.json_data.ajax && settings.json_data.ajax.url) {
                    //app id's are the md5 hash of the root ajax data url
                    return MD5(settings.json_data.ajax.url(-1));
                }
                return null;
            },
            getApplicationState: function (app) {
                ///<summary>Gets the data persisted for the app</summary>

                //generate an id for the current app
                var persistenceId = "tree_" + app;
                if (Modernizr.sessionstorage) {
                    var ssItem = sessionStorage.getItem(persistenceId);
                    if (ssItem) {
                        return eval("(" + ssItem + ")");
                    }
                }               
                return null;
            },
            saveApplicationState: function (app) {
                ///<summary>Saves the current state of the tree for the specified app so it can be restored. Stores the persisted data, this will check if we hvae a sessionStorage available, otherwise it will use sessvar (window.name) to store the values.</summary>

                if (this.data.core.refreshing) { return; }
                var nodeData = this.get_json(-1, ["id", "class"], ["href"]);

                //store the selected node                
                var selected = [];
                this.get_selected().each(function () {
                    selected.push($(this).attr("id"));
                });

                var toPersist = { nodeData: nodeData, selectedNodes: selected };

                //generate an id for the current app
                var persistenceId = "tree_" + app;
                if (Modernizr.sessionstorage) {
                    sessionStorage.setItem(persistenceId, JSON.stringify(toPersist));
                }
            }
        }
    });
})(jQuery);