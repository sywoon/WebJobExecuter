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
        this._runUpdateToolAsync(projName, cbk)
        
        // this.mgr.timer.once(3000, this, ()=>{
        //     console.log("chg status 1=========")
        //     cfgStatus.status = Define.PROJECT_STATUS.EXPORT_PROTOL
        //     voProjStatus.setProjStatus(projName, cfgStatus)
        // })

        // this.mgr.timer.once(6000, this, ()=>{
        //     console.log("chg status 2=========")
        //     cfgStatus.status = Define.PROJECT_STATUS.NONE
        //     voProjStatus.setProjStatus(projName, cfgStatus)
        //     cbk && cbk()
        // })
    }

    _runUpdateToolAsync(projName) {
        console.log("_runUpdateToolAsync", projName)

        let projConfig = this.logic.projConfig
        let toolRootPath = projConfig.getToolRootPath()
        let projPath = projConfig.getProjectPath(projName)
        let projBranch = projConfig.getProjectBranch(projName)
        let update_tool_cmd = "update_client_all.bat"
        let cmd = `start cmd /C ${toolRootPath}/tools/${update_tool_cmd} ${projName} ${projPath} ${projBranch}`

        let key = Define.VO.DATA_PROJ_STATUS
        let voProjStatus = this.logic.getData(key)
        voProjStatus.startReadConfig()  //工具中 通过修改文件 来同步执行进度

        this.getPlugin().runBatCmd(cmd, ()=>{
            voProjStatus.stopReadConfig()
        })
    }
}


module["exports"] = JobUpdateClient