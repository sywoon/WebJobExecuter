const JobBase = require("../../framework/jobs/job_base")
const Define = require ("../../define")

class JobSyncArtRes extends JobBase {
    // data: {projName:projName}
    // result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    dealDataAsync(data, result, cbk) {
        let key = Define.VO.DATA_PROJ_STATUS
        let voProjStatus = this.logic.getData(key)
        let cfgStatus = voProjStatus.getProjStatus(data.projName)

        cfgStatus.status = Define.PROJECT_STATUS.SYNC_ART_RES
        voProjStatus.setProjStatus(data.projName, cfgStatus)

        result.data = {projName: data.projName}
        this.mgr.timer.once(5000, this, ()=>{
            console.log("chg status 3=========")
            cfgStatus.status = Define.PROJECT_STATUS.NONE
            voProjStatus.setProjStatus(data.projName, cfgStatus)
            cbk && cbk()
        })
    }
}


module["exports"] = JobSyncArtRes

