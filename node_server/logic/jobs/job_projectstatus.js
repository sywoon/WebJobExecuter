const JobBase = require("../../framework/jobs/job_base")
const logger = require ("../../framework/libs/logger")
const Define = require ("../../define")


class JobProjectStatus extends JobBase {
    // {plugin_type:number, cmd:string|number, data:{...}}
    // data.data: {projName:projName}
    // result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    dealData(data, result) {
        let JOB_CODE = Define.JOB_CODE
        if (data.cmd == JOB_CODE.STATUS_PROJECT) {
            this._dealData_ProjStatus(data.data, result)
        } else if (data.cmd == JOB_CODE.STATUS_RESET_STATUS) {
            this._dealData_ResetStatus(data.data, result)
        }
    }

    _dealData_ProjStatus(data, result) {
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

    _dealData_ResetStatus(data, result) {
        if (!data.projName) {
            result.code = Define.CMD_ERROR.COMMON
            result.msg = "param error:lost projName. data:" + JSON.stringify(data)
            return
        }

        let key = Define.VO.DATA_PROJ_STATUS
        let voProjStatus = this.logic.getData(key)
        let cfgStatus = voProjStatus.getProjStatus(data.projName)

        cfgStatus.status = Define.PROJECT_STATUS.NONE
        voProjStatus.setProjStatus(data.projName, cfgStatus)
        this.logic.projConfig.removeProjectGitVersion(data.projName)
    }
}


module["exports"] = JobProjectStatus

