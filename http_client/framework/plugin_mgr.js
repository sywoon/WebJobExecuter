(function(exports) {
    
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
            this.serverSendCall = null
        }

        registerPlugins() {
            assert(this.plugins.length == 0)
            for (let type in PluginConfig) {
                let plugin = new PluginConfig[type](this)
                this.plugins[type] = plugin
            }
        }

        setServerSendCall(call) {
            this.serverSendCall = call
        }

        // {plugin_type:number, data:{...}}
        sendServerCmd(data) {
            this.serverSendCall && this.serverSendCall(data)
        }

        // {plugin_type:number, data:{...}}
        dealResponseData(data) {
            if (!data || !data.plugin_type) {
                console.error("data is null")
                return
            }

            let plugin = this.plugins[data.plugin_type]
            if (!plugin) {
                console.error("plugin not found:" + data.plugin_type)
                return
            }
            plugin.dealData(data.data, responseBack)
        }
    }

    exports.PLUGIN_TYPE = PLUGIN_TYPE
    exports.PluginMgr = PluginMgr
})(window)