const JobBase = require("../../framework/jobs/job_base")
const logger = require("../../framework/libs/logger")
const Define = require ("../../define")

class JobUpdateClient extends JobBase {
    // data: {projName:projName}
    // result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    dealDataAsync(data, result, cbk) {
        let key = Define.VO.DATA_PROJ_STATUS
        let voProjStatus = this.logic.getData(key)
        let cfgStatus = voProjStatus.getProjStatus(data.projName)

        cfgStatus.status = Define.PROJECT_STATUS.PREPARE
        voProjStatus.setProjStatus(data.projName, cfgStatus)

        logger.log("JobUpdateClient", data, result)
        
        this.mgr.timer.once(3000, this, ()=>{
            console.log("chg status 1=========")
            cfgStatus.status = Define.PROJECT_STATUS.EXPORT_PROTOL
            voProjStatus.setProjStatus(data.projName, cfgStatus)
        })

        this.mgr.timer.once(6000, this, ()=>{
            console.log("chg status 2=========")
            cfgStatus.status = Define.PROJECT_STATUS.NONE
            voProjStatus.setProjStatus(data.projName, cfgStatus)
            cbk && cbk()
        })
    }
}


module["exports"] = JobUpdateClient