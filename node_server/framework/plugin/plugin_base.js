const logger = require ("./../libs/logger")
const Define = require ("./../../define")


let CMD_ERROR = Define.CMD_ERROR

class PluginBase {
    constructor(type, mgr) {
        this.type = type
        this.mgr = mgr
        this.jobGroup = {}
    }

    registerJobGroup(key, group) {
        this.jobGroup[key] = group
    }

    // {plugin_type:number, cmd:string|number, data:{...}}
    dealData(data, result) {
        let group = this.jobGroup[data.cmd]
        if (!group) {
            result.code = CMD_ERROR.CMD_LOST
            logger.error("group not found", data)
            return
        }

        group.dealData(data, result)
    }
}




module['exports'] = PluginBase
