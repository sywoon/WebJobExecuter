const JobGroup = require("../framework/jobs/job_group")
const JobProjectStatus = require("./jobs/job_projectstatus")
const JobProjectVersion = require("./jobs/job_projectversion")
const JobUpdateClient = require("./jobs/job_updateclient")
const PM = require("../framework/plugin_mgr")


let CMD_CODE = {
    UPDATE_CLIENT: 1,
    UPDATE_PROGRESS: 2,
    REQ_ALL_PROJECTS: 3,
    SERVER_IS_BUSY: 4,
    SYNC_ART_RES: 5, //同步美术资源

    ERROR: 100,
}

let CMD_JOBGROUP = {
    [CMD_CODE.UPDATE_CLIENT] : [JobUpdateClient]
}

let STATUS_JOBGROUP = {
    ["project_status"] : [JobProjectStatus]
}

let FILE_JOBGROUP = {
    ["file_proj_version"] : [JobProjectVersion]
}

class Logic {
    constructor(pluginMgr) {
        this.pluginMgr = pluginMgr
    }

    registerAll() {
        let PLUGIN_TYPE = PM.PLUGIN_TYPE
        this._registerTypeJobs(PLUGIN_TYPE.CMD, CMD_JOBGROUP)
        this._registerTypeJobs(PLUGIN_TYPE.STATUS, STATUS_JOBGROUP)
        this._registerTypeJobs(PLUGIN_TYPE.FILE, FILE_JOBGROUP)
    }

    _registerTypeJobs(type, groups) {
        for (let key in groups) {
            let group = new JobGroup()
            for (let cls of groups[key]) {
                group.addJob(new cls())
            }
            this.pluginMgr.registerJobGroup(type, key, group)
        }
    }
}


module["exports"] = Logic