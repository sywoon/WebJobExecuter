const PluginBase = require("./plugin_base")
const Define = require ("./../../define")
const child_process = require('child_process')
const logger = require ("../libs/logger")
const Utils = require("../utils")

const CMD_ERROR = Define.CMD_ERROR


// 命名执行器：和客户端交互具体的业务逻辑
// 一次执行一个 用于消耗比较大的任务
class PluginCmdExecuter extends PluginBase {
    constructor(type, mgr) {
        super(type, mgr)
        this.inprocess = false
    }

    // {plugin_type:number, cmd:string|number, data:{...}}
    dealData(data, result) {
        if (this.inprocess) {
            result.code = CMD_ERROR.BUSY
            result.data = data.data
            return
        }

        super.dealData(data, result, ()=> {
            this.inprocess = true
        })
    }

    runBatCmd(cmd, cbk) {
        Utils.runCmd(cmd, cbk)
    }
}



module['exports'] = PluginCmdExecuter