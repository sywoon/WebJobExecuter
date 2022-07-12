
// 状态数据同步器：内容和实现双端自己约定 

const PluginBase = require("./plugin_base");

// 数据来源任意：可文件 可内存
class PluginStatusData extends PluginBase {

    dealData(data, result) {
        this.jobGroup.dealData(data, result)
    }
}




module['exports'] = PluginStatusData