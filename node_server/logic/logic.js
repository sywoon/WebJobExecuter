const JobGroup = require("../framework/jobs/job_group")
const JobProjectStatus = require("./jobs/job_projectstatus")
const JobReadConfigFile = require("./jobs/job_readconfigfile")
const JobUpdateClient = require("./jobs/job_updateclient")
const JobSyncArtRes = require("./jobs/job_syncartres")
const EventDispatcher = require("../framework/libs/event_dispatcher")
const Define = require("./../define")

let PLUGIN_TYPE = Define.PLUGIN_TYPE
let CMD_CODE = {
    UPDATE_CLIENT: 1,
    SYNC_ART_RES: 2, //同步美术资源
}

let CMD_JOBGROUP = {
    [CMD_CODE.UPDATE_CLIENT] : [JobUpdateClient],
    [CMD_CODE.SYNC_ART_RES] : [JobSyncArtRes],
}

let STATUS_JOBGROUP = {
    ["status_project_status"] : [JobProjectStatus],
    ["status_all_projects"] : [JobProjectStatus],
}

let FILE_JOBGROUP = {
    ["file_read_config"] : [JobReadConfigFile],
}

class Logic extends EventDispatcher {
    constructor(mgr) {
        super()
        this.mgr = mgr
    }

    registerAll() {
        this._registerTypeJobs(PLUGIN_TYPE.CMD, CMD_JOBGROUP, true)
        this._registerTypeJobs(PLUGIN_TYPE.STATUS, STATUS_JOBGROUP, false)
        this._registerTypeJobs(PLUGIN_TYPE.FILE, FILE_JOBGROUP, false)
    }

    _registerTypeJobs(type, groups, isAsync) {
        let pluginMgr = this.mgr.plugin
        for (let key in groups) {
            let group = new JobGroup(this.mgr, key, type, isAsync)
            for (let cls of groups[key]) {
                group.addJob(new cls(group))
            }
            pluginMgr.registerJobGroup(type, key, group)
        }
    }
}


module["exports"] = Logic