(function(exports) {
    class JobBase {
        constructor(cmd, pluginType) {
            this.cmd = cmd
            this.pluginType = pluginType
        }

        getPlugin() {
            return mgr.plugin.getPlugin(this.pluginType)
        }
    
        sendServerCmd(data) {
            let plugin = this.getPlugin()
            plugin.sendServerCmd(this.cmd, data)
        }
    
        dealData(data) {}
    }
    
    exports.JobBase = JobBase
})(window)


