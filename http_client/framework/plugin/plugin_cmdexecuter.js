(function(exports) {

    // 命名执行器：和客户端交互具体的业务逻辑
    class PluginCmdExecuter extends PluginBase {
        dealData(data) {
            this.jobGroup.dealData(data, result)
            responseBack("PluginCmdExecuter", data)
        }
    }


    exports.PluginCmdExecuter = PluginCmdExecuter
})(window)