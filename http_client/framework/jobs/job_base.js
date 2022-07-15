(function(exports) {
    class JobBase {
        constructor(cmd, pluginType, logic) {
            this.cmd = cmd
            this.pluginType = pluginType
            this.logic = logic
            this.mgr = logic.mgr
        }

        getPlugin() {
            return this.mgr.plugin.getPlugin(this.pluginType)
        }
    
        sendServerCmd(data) {
            let plugin = this.getPlugin()
            plugin.sendServerCmd(this.cmd, data)
        }
    
        dealData(data) {}
    }
    
    exports.JobBase = JobBase
})(window)


