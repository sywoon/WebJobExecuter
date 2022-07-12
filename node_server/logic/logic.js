const JobGroup = require("../framework/jobs/job_group")
const JobProjectStatus = require("./jobs/job_projectstatus")
const JobProjectVersion = require("./jobs/job_projectversion")
const JobUpdateClient = require("./jobs/job_updateclient")


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
        this._registerCmdJobs()
        this._registerStatusJobs()
        this._registerFileJobs()
    }

    _registerCmdJobs() {
        for (let cmd in CMD_JOBGROUP) {
            let group = new JobGroup()
            for (let cls of CMD_JOBGROUP[cmd]) {
                group.addJob(new cls())
            }
            this.pluginMgr.registerCmdJobGroup(cmd, group)
        }
    }

    _registerStatusJobs() {
        for (let key in STATUS_JOBGROUP) {
            this.pluginMgr.registerStatusJobGroup(key, group)
        }
    }

    _registerFileJobs() {
        for (let key in FILE_JOBGROUP) {
            this.pluginMgr.registerFileJobGroup(key, group)
        }
    }
}


module['exports'] = Logic