import {EventDispatcher} from "./../framework/libs/event_dispatcher.js"
import {Define, JOB_CODE, PLUGIN_TYPE} from "./../define.js"
import {JobUpdateClient} from "./jobs/job_updateclient.js"
import {JobSyncArtRes} from "./jobs/job_syncartres.js"
import {JobProjectStatus} from "./jobs/job_projectstatus.js"
import {JobReadConfigFile} from "./jobs/job_readconfigfile.js"
import {MoniUpdateClient} from "./monitor/moni_updateclient.js"
import {MoniSyncJob} from "./monitor/moni_syncjob.js"
import {ProjectStatusVo} from "./vo/vo_projectstatus.js"

let CMD_JOBSENDER = {
    [JOB_CODE.CMD_UPDATE_CLIENT] : [JobUpdateClient, MoniUpdateClient],
    [JOB_CODE.CMD_SYNC_ART_RES] : [JobSyncArtRes, MoniUpdateClient],
}

let STATUS_JOBSENDER = {
    [JOB_CODE.STATUS_PROJECT] : [JobProjectStatus, MoniSyncJob],
    [JOB_CODE.STATUS_RESET_STATUS] : [JobProjectStatus, MoniSyncJob],
}

let FILE_JOBSENDER = {
    [JOB_CODE.FILE_READ_CONFIG] : [JobReadConfigFile, MoniSyncJob],
}

export class Logic extends EventDispatcher {
    constructor(mgr) {
        super()
        this.mgr = mgr
        this.datas = {}
        this.jobs = {}
        this._initVo()
    }

    //业务功能 初始数据
    _initVo() {
        let key = Define.VO.DATA_PROJ_STATUS
        let vo = new ProjectStatusVo(this)
        this.saveData(key, vo)
    }

    updateVoData() {
        this.updateVoProjStatus()
    }

    updateVoProjStatus() {
        let key = Define.VO.DATA_PROJ_STATUS
        let vo = this.getData(key)
        vo.updateData()
    }

    getJobSender(key) {
        return this.jobs[key]
    }

    makeUniqueKey(cmd, data) {
        let key
        switch (cmd) {
            case JOB_CODE.CMD_UPDATE_CLIENT:
            case JOB_CODE.CMD_SYNC_ART_RES:
                key = `${cmd}_${data.projName}`

            case JOB_CODE.STATUS_PROJECT:
                if (data.projName) {
                    key = `${cmd}_${data.projName}`
                } else {
                    key = `${cmd}`
                }
                break
            case JOB_CODE.STATUS_RESET_STATUS:
                key = `${cmd}_${data.projName}`
                break
            case JOB_CODE.FILE_READ_CONFIG:
                key = `${cmd}_${data.filename}`
                break
            default:
                key = `${cmd}`
        }
        return key
    }

    sendJobCmd(cmd, data, method, owner) {
        let job = this.getJobSender(cmd)
        data.__key = this.makeUniqueKey(cmd, data)
        job.sendServerCmd(data)
        if (method) {
            this.once(data.__key, owner, method)
        }
    }

    onJobCmdBack(cmd, data) {
        let key = this.makeUniqueKey(cmd, data)
        this.fire(key, data)
    }

    saveData(key, data) {
        this.datas[key] = data
    }

    getData(key) {
        return this.datas[key]
    }


    registerAll() {
        this._registerTypeJobs(PLUGIN_TYPE.CMD, CMD_JOBSENDER)
        this._registerTypeJobs(PLUGIN_TYPE.STATUS, STATUS_JOBSENDER)
        this._registerTypeJobs(PLUGIN_TYPE.FILE, FILE_JOBSENDER)
    }

    _registerTypeJobs(type, senders) {
        let pluginMgr = this.mgr.plugin
        for (let key in senders) {
            let cmd = Number(key)
            let arr = senders[key]
            let sender = new arr[0](cmd, type, this)
            if (arr[1]) {
                sender.setMonitor(new arr[1](sender))
            }
            pluginMgr.registerJobSender(type, key, sender)
            this.jobs[key] = sender
        }
    }
}