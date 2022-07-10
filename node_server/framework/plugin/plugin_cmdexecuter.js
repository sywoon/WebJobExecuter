const PluginBase = require("./plugin_base");


// 命名执行器：和客户端交互具体的业务逻辑
class PluginCmdExecuter extends PluginBase {
    dealData(data, responseBack) {
        responseBack("PluginCmdExecuter", {aa:11}, "11")
    }
}



module['exports'] = PluginCmdExecuter