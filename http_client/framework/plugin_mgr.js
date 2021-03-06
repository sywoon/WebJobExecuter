import {PLUGIN_TYPE, CMD_ERROR} from "./../define.js"
import {PluginFileContent} from "./plugin/plugin_filecontent.js"
import {PluginCmdExecuter} from "./plugin/plugin_cmdexecuter.js"
import {PluginStatusData} from "./plugin/plugin_statusdata.js"

let PluginConfig = {
    [PLUGIN_TYPE.FILE] : PluginFileContent,
    [PLUGIN_TYPE.CMD] : PluginCmdExecuter,
    [PLUGIN_TYPE.STATUS] : PluginStatusData,
}

export class PluginMgr {

    constructor() {
        this.plugins = []
        this.serverSendCall = null
    }

    registerPlugins() {
        console.assert(this.plugins.length == 0)
        for (let type in PluginConfig) {
            let plugin = new PluginConfig[type](type, this)
            this.plugins[type] = plugin
        }
    }

    registerJobSender(type, key, sender) {
        this.plugins[type].registerJobSender(key, sender)
    }

    getPlugin(type) {
        return this.plugins[type]
    }

    setServerSendCall(call) {
        this.serverSendCall = call
    }

    // {plugin_type:number, cmd:string|number, data:{...}}
    sendServerCmd(data) {
        this.serverSendCall && this.serverSendCall(data)
    }

    setServerBusyCall(call) {
        this.serverBusyCall = call
    }

    //data: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    dealResponseData(data) {
        if (!data || !data.plugin_type) {
            console.error("data is null")
            return
        }

        //通用错误 统一处理 
        if (data.code == CMD_ERROR.COMMON) {
            console.error(data.msg)
            return
        } else if (data.code == CMD_ERROR.BUSY) {
            if (this.serverBusyCall) {
                let copy = {plugin_type:data.plugin_type, cmd:data.cmd, data:data.data}
                this.serverBusyCall(copy)
            }
            return
        }

        let plugin = this.plugins[data.plugin_type]
        if (!plugin) {
            console.error("plugin not found:" + data.plugin_type)
            return
        }
        plugin.dealData(data)
    }
}
