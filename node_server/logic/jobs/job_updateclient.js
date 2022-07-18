const JobBase = require("../../framework/jobs/job_base")
const logger = require("../../framework/libs/logger")
const Define = require ("../../define")

class JobUpdateClient extends JobBase {
    // {plugin_type:number, cmd:string|number, data:{...}}
    // data.data: {projName:projName}
    // result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    dealDataAsync(data, result, cbk) {
        let projName = data.data.projName
        if (!projName) {
            result.code = Define.CMD_ERROR.COMMON
            result.msg = "param error:lost projName. data:" + JSON.stringify(data)
            return
        }

        let key = Define.VO.DATA_PROJ_STATUS
        let voProjStatus = this.logic.getData(key)
        if (!voProjStatus.isAllDone()) {
            result.code = Define.CMD_ERROR.BUSY
            result.data = data.data
            return
        }

        let cfgStatus = voProjStatus.getProjStatus(projName)
        cfgStatus.status = Define.PROJECT_STATUS.PREPARE
        voProjStatus.setProjStatus(projName, cfgStatus)

        result.data = {projName: projName}
        
        this.mgr.timer.once(3000, this, ()=>{
            console.log("chg status 1=========")
            cfgStatus.status = Define.PROJECT_STATUS.EXPORT_PROTOL
            voProjStatus.setProjStatus(projName, cfgStatus)
        })

        this.mgr.timer.once(6000, this, ()=>{
            console.log("chg status 2=========")
            cfgStatus.status = Define.PROJECT_STATUS.NONE
            voProjStatus.setProjStatus(projName, cfgStatus)
            cbk && cbk()
        })
    }
}


module["exports"] = JobUpdateClient