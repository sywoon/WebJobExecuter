const assert = require ("assert")
let PluginCmdExecuter = require ("./plugin/plugin_cmdexecuter")
let PluginFileContent = require ("./plugin/plugin_filecontent")
let PluginStatusData = require ("./plugin/plugin_statusdata")


let PLUGIN_TYPE = {
    "FILE" : 1,
    "CMD" : 2,
    "STATUS" : 3,
}

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
            let plugin = new PluginConfig[type](this)
            this.plugins[type] = plugin
        }
    }

    registerCmdJobGroup(cmd, group) {
        this.plugins[PLUGIN_TYPE.CMD].registerJobGroup(cmd, group)
    }

    registerStatusJobGroup(key, group) {
        this.plugins[PLUGIN_TYPE.STATUS].registerJobGroup(key, group)
    }

    registerFileJobGroup(key, group) {
        this.plugins[PLUGIN_TYPE.FILE].registerJobGroup(key, group)
    }

    // {plugin_type:number, data:{...}}
    dealResponseData(data, responseBack) {
        if (!data || !data.plugin_type) {
            console.error("data is null")
            return
        }

        let plugin = this.plugins[data.plugin_type]
        if (!plugin) {
            console.error("plugin not found:" + data.plugin_type)
            return
        }

        let result = {code:0, data:{}, msg:""}
        plugin.dealData(data.data, result)
        responseBack(result.code, result.data, result.msg)
    }
}




module['exports'] = PluginMgr