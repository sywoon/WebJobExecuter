import {Define, JOB_CODE, EVT_LOGIC, PROJECT_STATUS} from "./../../define.js"

export class ProjectStatusVo {
    constructor(logic) {
        this.logic = logic
        this.mgr = logic.mgr
        this.projStatusAll = {}
    }

    //ERROR 也表示业务结束
    isStatusDone(projName) {
        let cfg = this.projStatusAll[projName]
        if (!cfg || cfg.status == undefined)  //没有数据 表示还未操作过
            return true
        
        return cfg.status == PROJECT_STATUS.NONE || cfg.status == PROJECT_STATUS.ERROR
    }

    setStatus(projName, v) {
        let cfg = this.projStatusAll[projName]
        if (!cfg) {
            this.projStatusAll[projName] = {status:v}
            return
        } 
        cfg.status = v
    }

    isAllDone() {
        let isDone = true
        for (let projName in this.projStatusAll) {
            let cfg = this.projStatusAll[projName]
            if (cfg.status == undefined)
                continue
            if (cfg.status != PROJECT_STATUS.NONE && cfg.status != PROJECT_STATUS.ERROR) {
                isDone = false
                break
            }
        }
        return isDone
    }

    updateData() {
        this.logic.sendJobCmd(JOB_CODE.STATUS_PROJECT, {}, this._onProjStatusBack, this)
    }

    //data {projName:, data:{状态数据 某一个}}
    //data {data:{状态数据 所有项目}}
    _onProjStatusBack(data) {
        if (data.projName) {
            this.setProjStatus(data.projName, data.data)
        } else {
            this.setProjStatusAll(data.data)
        }

        if (!this.isAllDone()) {
            this.mgr.timer.once(Define.PROJ_STATUS_UPDATE_INTERVEL, this, this.updateData)
        }
    }

    // "master":{"errMsg":"","status":0,"startTime":1647500026000,"lastUpdateTime":1647500075000}
    getProjStatus(projName) {
        return this.projStatusAll[projName] || {}
    }

    getProjStatusAll() {
        return this.projStatusAll
    }

    setProjStatus(projName, data) {
        this.projStatusAll[projName] = data
        this.logic.fire(EVT_LOGIC.PROJ_STATUS_UPDATE, this)
    }

    setProjStatusAll(data) {
        this.projStatusAll = data
        this.logic.fire(EVT_LOGIC.PROJ_STATUS_UPDATE, this)
    }
}