const assert = require ("assert")
let PluginCmdExecuter = require ("./plugin/plugin_cmdexecuter")
let PluginFileContent = require ("./plugin/plugin_filecontent")
let PluginStatusData = require ("./plugin/plugin_statusdata")
let Define = require ("./../define")



let PLUGIN_TYPE = Define.PLUGIN_TYPE

let PluginConfig = {
    [PLUGIN_TYPE.FILE] : PluginFileContent,
    [PLUGIN_TYPE.CMD] : PluginCmdExecuter,
    [PLUGIN_TYPE.STATUS] : PluginStatusData,
}

class PluginMgr {

    constructor() {
        this.plugins = []
    }

    registerPlugins() {
        assert(this.plugins.length == 0)
        for (let type in PluginConfig) {
            let plugin = new PluginConfig[type](type, this)
            this.plugins[type] = plugin
        }
    }

    registerJobGroup(type, cmd, group) {
        this.plugins[type].registerJobGroup(cmd, group)
    }

    // {plugin_type:number, cmd:string|number, data:{...}}
    dealResponseData(data, responseBack) {
        if (!data || !data.plugin_type) {
            console.error("data is null")
            return
        }

        console.log("dealResponseData", data)
        let plugin = this.plugins[data.plugin_type]
        if (!plugin) {
            console.error("plugin not found:" + data.plugin_type)
            return
        }

        let result = {plugin_type:data.plugin_type, cmd:data.cmd, code:0, data:{}, msg:""}
        plugin.dealData(data, result)
        console.log("dealResponseData", data, result)
        responseBack(0, result)
    }
}




module['exports'] = PluginMgr