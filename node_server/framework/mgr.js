const PluginMgr = require("./plugin_mgr")


class Mgr {
    initAll() {
        let pluginMgr = new PluginMgr()
        pluginMgr.registerPlugins()
        this.plugin = pluginMgr
    }
}


module["exports"] = Mgr
