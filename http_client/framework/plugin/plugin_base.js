(function(exports) {
    class PluginBase {
        constructor(mgr) {
            this.mgr = mgr
        }
    
        sendServerCmd(data) {
            this.mgr.sendServerCmd(data)
        }
    
        dealData(data, responseBack) {}
    }
    
    exports.PluginBase = PluginBase
})(window)


