(function(exports) {
    class PluginBase {
        constructor(type, mgr) {
            this.type = type
            this.mgr = mgr
            this.jobSender = {}
        }

        registerJobSender(key, sender) {
            this.jobSender[key] = sender
        }
    
        sendServerCmd(cmd, data) {
            this.mgr.sendServerCmd({plugin_type:this.type, cmd:cmd, data:data})
        }
    
        // {plugin_type:0, error:0, code:0, cmd:number|string, data:{}, msg:""}
        dealData(data) {
            let sender = this.jobSender[data.cmd]
            if (!sender) {
                console.error("sender not found", data)
                return
            }
            sender.dealData(data)
        }
    }
    
    exports.PluginBase = PluginBase
})(window)


