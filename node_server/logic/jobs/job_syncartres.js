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
        if (!voProjStatus.isAllDone()) {
            result.code = Define.CMD_ERROR.BUSY
            result.data = data.data
            return
        }

        let cfgStatus = voProjStatus.getProjStatus(projName)
        cfgStatus.status = Define.PROJECT_STATUS.SYNC_ART_RES
        voProjStatus.setProjStatus(projName, cfgStatus)

        result.data = {projName: projName}
        this._runSyncResToolAsync(projName, cbk)

        // this.mgr.timer.once(5000, this, ()=>{
        //     console.log("chg status 3=========")
        //     cfgStatus.status = Define.PROJECT_STATUS.NONE
        //     voProjStatus.setProjStatus(projName, cfgStatus)
        //     cbk && cbk()
        // })
    }

    //step1: 同步资源
    _runSyncResToolAsync(projName) {
        console.log("_runSyncResToolAsync", projName)
        
        let projConfig = this.logic.projConfig
        let toolRootPath = projConfig.getToolRootPath()
        let projPath = projConfig.getProjectPath(projName)
        let projBranch = projConfig.getProjectBranch(projName)
        let sync_res_tool_cmd = "sync_res_from_uiedit.bat"  //start cmd /C 
        let cmd = `${toolRootPath}/tools/${sync_res_tool_cmd} ${projName} ${projPath} ${projBranch}`

        let key = Define.VO.DATA_PROJ_STATUS
        let voProjStatus = this.logic.getData(key)
        voProjStatus.startReadConfig()  //工具中 通过修改文件 来同步执行进度

        this.getPlugin().runBatCmd(cmd, ()=>{
            if (voProjStatus.isStatusError(projName)) {
                voProjStatus.stopReadConfig()
                return
            }
            this._spineScale(projName)
        })
    }

    //step2：压缩spine
    _spineScale(projName) {
        let key = Define.VO.DATA_PROJ_STATUS
        let voProjStatus = this.logic.getData(key)

        let projConfig = this.logic.projConfig
        let imgComCfg = projConfig.getProjectImgCompress(projName)
        if (!imgComCfg["spine_scale"]) {   //"spine_scale" : "sync_res_sk_scale_mini.bat",
            voProjStatus.stopReadConfig()
            return
        }

        let cfgStatus = voProjStatus.getProjStatus(projName)
        cfgStatus.status = Define.PROJECT_STATUS.COMPRESS_SPINE
        voProjStatus.setProjStatus(projName, cfgStatus)

        let projPath = projConfig.getProjectPath(projName)
        let cmd = `${projPath}/shj_client_git/tools/image_scale_size/${imgComCfg["spine_scale"]}`
        this.getPlugin().runBatCmd(cmd, (error, stdout, stderr)=>{
            cfgStatus.status = Define.PROJECT_STATUS.NONE
            voProjStatus.setProjStatus(projName, cfgStatus)

            voProjStatus.stopReadConfig()
        })
    }
}


module["exports"] = JobSyncArtRes

