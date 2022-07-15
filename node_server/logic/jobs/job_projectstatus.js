const JobBase = require("../../framework/jobs/job_base")
const logger = require ("../../framework/libs/logger")
const Define = require ("../../define")


class JobProjectStatus extends JobBase {
    // data: {projName:projName}
    // result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    dealData(data, result) {
        let key = Define.VO.DATA_PROJ_STATUS
        let voProjStatus = this.logic.getData(key)

        let cfgStatus
        if (data.projName) {
            cfgStatus = voProjStatus.getProjStatus(data.projName)
            result.data = {projName:data.projName, data:cfgStatus}
        } else {
            cfgStatus = voProjStatus.getProjStatusAll()
            result.data = {data:cfgStatus}
        }
        
    }
}


module["exports"] = JobProjectStatus

