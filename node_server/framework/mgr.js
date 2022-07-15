const Timer = require("./libs/timer")
const PluginMgr = require("./plugin_mgr")


class Mgr {
    initAll() {
        let pluginMgr = new PluginMgr()
        pluginMgr.registerPlugins()
        this.plugin = pluginMgr

        let timer = new Timer()
        this.timer = timer

        setInterval(()=>{
            this.timer.update()
        }, 1000/30)
    }
}


module["exports"] = Mgr
