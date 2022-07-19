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
        this._uieditCompileConfig(projName)
    }

    //step1: 替换uiedit编译配置文件
    _uieditCompileConfig(projName) {
        let projConfig = this.logic.projConfig
        let imgComCfg = projConfig.getProjectImgCompress(projName)
        if (!imgComCfg["uiedit_compile_config"]) {  //"uiedit_compile_config" : "program_mini.laya",
            this._updateClientAll(projName)
            return
        }
        
        let cmd = `${toolRootPath}/tools/uiedit_compile_config.bat ${imgComCfg["uiedit_compile_config"]} ${projPath}`
        this.getPlugin().runBatCmd(cmd, (error, stdout, stderr)=>{
            this._updateClientAll(projName)
        })
    }

    //step2: 更新 编译客户端
    _updateClientAll(projName) {
        let projConfig = this.logic.projConfig
        let toolRootPath = projConfig.getToolRootPath()
        let projPath = projConfig.getProjectPath(projName)
        let projBranch = projConfig.getProjectBranch(projName)
            
        let key = Define.VO.DATA_PROJ_STATUS
        let voProjStatus = this.logic.getData(key)
        voProjStatus.startReadConfig()  //工具中 通过修改文件 来同步执行进度

        //start cmd /C
        let cmd = `${toolRootPath}/tools/update_client_all.bat ${projName} ${projPath} ${projBranch}`
        this.getPlugin().runBatCmd(cmd, (error, stdout, stderr)=>{
            if (voProjStatus.isStatusError(projName)) {
                voProjStatus.stopReadConfig()
                return
            }
            this._uiScale(projName)
        })
    }

    //step3: 压缩图片
    _uiScale(projName) {
        let projConfig = this.logic.projConfig
        let imgComCfg = projConfig.getProjectImgCompress(projName)

        let key = Define.VO.DATA_PROJ_STATUS
        let voProjStatus = this.logic.getData(key)
        if (!imgComCfg["ui_scale"]) {   //"ui_scale" : "run_ui_scale_mini.bat"
            voProjStatus.stopReadConfig()
            return
        }

        let cfgStatus = voProjStatus.getProjStatus(projName)
        cfgStatus.status = Define.PROJECT_STATUS.COMPRESS_IMAGE
        voProjStatus.setProjStatus(projName, cfgStatus)

        let projPath = projConfig.getProjectPath(projName)
        let cmd = `${projPath}/shj_client_git/tools/image_scale_size/${imgComCfg["ui_scale"]}`
        this.getPlugin().runBatCmd(cmd, (error, stdout, stderr)=>{
            cfgStatus.status = Define.PROJECT_STATUS.NONE
            voProjStatus.setProjStatus(projName, cfgStatus)

            voProjStatus.stopReadConfig()
        })
    }
}


module["exports"] = JobUpdateClient