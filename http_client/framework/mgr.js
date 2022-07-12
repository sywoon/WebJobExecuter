(function(exports){
    class Mgr {

        initAll(cbk) {
            let syncLoaded = new SyncLoaded(cbk)

            syncLoaded.addCheck("toolsCfg")
            this.toolsCfg = new ToolsConfig(syncLoaded.cbkListener.bind(syncLoaded, "toolsCfg"))

            let pluginMgr = new PluginMgr()
            this.pluginMgr = pluginMgr
        }
    }

    exports.Mgr = Mgr
})(window)