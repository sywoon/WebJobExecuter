(function(exports) {
    let CMD_JOBSENDER = {
        [CMD_CODE.UPDATE_CLIENT] : JobUpdateClient,
        [CMD_CODE.SYNC_ART_RES] : JobSyncArtRes,
    }
    
    let STATUS_JOBSENDER = {
        ["status_project_status"] : JobProjectStatus,
        ["status_all_projects"] : JobProjectStatus,
    }
    
    let FILE_JOBSENDER = {
        ["file_proj_version"] : JobProjectVersion,
    }

    class Logic extends EventDispatcher {
        constructor() {
            super()
            this.datas = {}
            this.jobs = {}
        }

        saveData(key, data) {
            this.datas[key] = data
        }

        getData(key) {
            return this.datas[key]
        }

        getJobSender(key) {
            return this.jobs[key]
        }

        sendJobData(key, data) {
            let job = this.getJobSender(key)
            job.sendServerCmd(data)
        }

        registerAll() {
            this._registerTypeJobs(PLUGIN_TYPE.CMD, CMD_JOBSENDER)
            this._registerTypeJobs(PLUGIN_TYPE.STATUS, STATUS_JOBSENDER)
            this._registerTypeJobs(PLUGIN_TYPE.FILE, FILE_JOBSENDER)
        }

        _registerTypeJobs(type, senders) {
            let pluginMgr = mgr.plugin
            for (let key in senders) {
                let sender = new senders[key](key, type)
                pluginMgr.registerJobSender(type, key, sender)
                this.jobs[key] = sender
            }
        }
    }

    exports.Logic = Logic
})(window)