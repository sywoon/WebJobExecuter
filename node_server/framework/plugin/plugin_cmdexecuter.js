const PluginBase = require("./plugin_base");

let CMD_ERROR = {
    "BUSY" : -1,
    "CMD_LOST" : -2,
    "UNKNOW" : -100,
}


// 命名执行器：和客户端交互具体的业务逻辑
// 一次执行一个 用于消耗比较大的任务
class PluginCmdExecuter extends PluginBase {
    constructor(mgr) {
        super(mgr)
        this.inprocess = false
    }

    // data:{cmd:number, data:{...}}
    dealData(data, result) {
        if (this.inprocess) {
            result.code = CMD_ERROR.BUSY
            return
        }

        let group = this.jobGroup[data.cmd]
        if (!group) {
            result.code = CMD_ERROR.CMD_LOST
            return
        }

        this.jobGroup.dealData(data, result, ()=> {
            this.inprocess = false
        })
    }
}



module['exports'] = PluginCmdExecuter