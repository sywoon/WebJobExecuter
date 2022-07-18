const JobGroup = require("../framework/jobs/job_group")
const JobProjectStatus = require("./jobs/job_projectstatus")
const JobReadConfigFile = require("./jobs/job_readconfigfile")
const JobUpdateClient = require("./jobs/job_updateclient")
const JobSyncArtRes = require("./jobs/job_syncartres")
const EventDispatcher = require("../framework/libs/event_dispatcher")
const Define = require("./../define")
const ProjectStatusVo = require("./vo/vo_projectstatus")


let PLUGIN_TYPE = Define.PLUGIN_TYPE
let JOB_CODE = Define.JOB_CODE

let CMD_JOBGROUP = {
    [JOB_CODE.CMD_UPDATE_CLIENT] : [JobUpdateClient],
    [JOB_CODE.CMD_SYNC_ART_RES] : [JobSyncArtRes],
}

let STATUS_JOBGROUP = {
    [JOB_CODE.STATUS_PROJECT] : [JobProjectStatus],
    [JOB_CODE.STATUS_RESET_STATUS] : [JobProjectStatus],
}

let FILE_JOBGROUP = {
    [JOB_CODE.FILE_READ_CONFIG] : [JobReadConfigFile],
}

class Logic extends EventDispatcher {
    constructor(mgr) {
        super()
        this.mgr = mgr
        this.datas = {}
        this._initVo()
    }

    _initVo() {
        let key = Define.VO.DATA_PROJ_STATUS
        let vo = new ProjectStatusVo(this)
        this.saveData(key, vo)
    }

    saveData(key, data) {
        this.datas[key] = data
    }

    getData(key) {
        return this.datas[key]
    }

    registerAll() {
        this._registerTypeJobs(PLUGIN_TYPE.CMD, CMD_JOBGROUP, true)
        this._registerTypeJobs(PLUGIN_TYPE.STATUS, STATUS_JOBGROUP, false)
        this._registerTypeJobs(PLUGIN_TYPE.FILE, FILE_JOBGROUP, false)
    }

    _registerTypeJobs(type, groups, isAsync) {
        let pluginMgr = this.mgr.plugin
        for (let key in groups) {
            let group = new JobGroup(this, key, type, isAsync)
            for (let cls of groups[key]) {
                group.addJob(new cls(group))
            }
            pluginMgr.registerJobGroup(type, key, group)
        }
    }
}


module["exports"] = Logic
