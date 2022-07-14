(function(exports){
    class Mgr {

        initAll(cbk) {
            let timer = new Timer()
            this.timer = timer

            let syncLoaded = new SyncLoaded(cbk)

            syncLoaded.addCheck("toolsCfg")
            this.toolsCfg = new ToolsConfig(syncLoaded.cbkListener.bind(syncLoaded, "toolsCfg"))

            let pluginMgr = new PluginMgr()
            pluginMgr.registerPlugins()
            this.plugin = pluginMgr

            setInterval(()=>{
                this.timer.update()
            }, 1000/30)
        }
    }

    exports.Mgr = Mgr
})(window)