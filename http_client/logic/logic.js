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
        ["file_read_config"] : JobReadConfigFile,
    }

    class Logic extends EventDispatcher {
        constructor() {
            super()
            this.datas = {}
            this.jobs = {}
        }

        startUpdateProStatus() {
            this._onTimerProStatus()
            // mgr.timer.loop(3000, this, this._onTimerProStatus)
        }

        stopUpdateProStatus() {
            mgr.timer.clear(this, this._onTimerProStatus)
        }

        _onTimerProStatus() {
            let cmd = "file_read_config"
            let filename = "update_dynamic_status.json"
            this.sendJobData(cmd, {filename:filename})

            let key = `${cmd}_${filename}`
            this.once(key, this, (data)=>{
                let content = JSON.parse(data.data.content)
                if (!content) {
                    console.error("parse json failed")
                    return
                }

                this.fire(EVT_HTTP_CLIENT.PROJECT_DYNAMIC_STATUS, content)
            })
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