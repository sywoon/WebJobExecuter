const JobBase = require("../../framework/jobs/job_base")
const Define = require ("../../define")

class JobSyncArtRes extends JobBase {
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
        let cfgStatus = voProjStatus.getProjStatus(projName)

        cfgStatus.status = Define.PROJECT_STATUS.SYNC_ART_RES
        voProjStatus.setProjStatus(projName, cfgStatus)

        result.data = {projName: projName}
        this.mgr.timer.once(5000, this, ()=>{
            console.log("chg status 3=========")
            cfgStatus.status = Define.PROJECT_STATUS.NONE
            voProjStatus.setProjStatus(projName, cfgStatus)
            cbk && cbk()
        })
    }
}


module["exports"] = JobSyncArtRes

