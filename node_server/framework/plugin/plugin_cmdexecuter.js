const PluginBase = require("./plugin_base")
const Define = require ("./../../define")
const child_process = require('child_process')
const logger = require ("../libs/logger")

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
        logger.log(`\n---run cmd:${cmd}`)
        child_process.exec(cmd, {maxBuffer: 1024 * 1024 * 10, encoding:"binary"}, (error, stdout, stderr) => {
            if (error) {
                let str = `批处理运行失败:${error}`
                logger.error(str)
            } else {
                logger.log("\n---cmd back\n")
                stdout && logger.warn(`stdout ${stdout}\n`)
                stderr && logger.warn(`stderr ${stderr}\n`)
                logger.log("---cmd end")
            }
            cbk(error, stdout, stderr)
        });
    }
}



module['exports'] = PluginCmdExecuter