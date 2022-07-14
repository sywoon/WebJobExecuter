(function(exports) {

    // 命名执行器：和客户端交互具体的业务逻辑
    class PluginCmdExecuter extends PluginBase {
        //data: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        dealData(data) {

            super.dealData(data)
        }
    }


    exports.PluginCmdExecuter = PluginCmdExecuter
})(window)