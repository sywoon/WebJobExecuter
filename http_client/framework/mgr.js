import {Timer} from "./libs/timer.js"
import {SyncLoaded} from "./libs/sync_loaded.js"
import {ToolsConfig} from "./tools_config.js"
import {PluginMgr} from "./plugin_mgr.js"

export class Mgr {

    initAll(cbk) {
        let timer = new Timer()
        this.timer = timer

        let syncLoaded = new SyncLoaded(cbk)

        syncLoaded.addCheck("toolsCfg")
        this.toolsCfg = new ToolsConfig(syncLoaded.cbkListener.bind(syncLoaded, "toolsCfg"))

        let pluginMgr = new PluginMgr()
        pluginMgr.registerPlugins()
        this.plugin = pluginMgr

        this.urlParams = this._parseUrlParams()

        setInterval(()=>{
            this.timer.update()
        }, 1000/30)
    }

    isAdmin() {
        return this.urlParams["admin"] == "1"
    }

    _parseUrlParams() {
        let searchHref = window.location.search.replace('?', '')
        let params = searchHref.split('&')
        let result = {}
        for (let param of params) {
            if (!param)  //empty string
                continue
            let arr = param.split('=')
            if (arr.length != 2)
                continue
            result[arr[0]] = arr[1]
        }
        return result
    }
}
