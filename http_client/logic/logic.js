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

        getJobSender(key) {
            return this.jobs[key]
        }

        sendJobData(cmd, data) {
            let job = this.getJobSender(cmd)
            job.sendServerCmd(data)
        }

        sendJobCmdFileData(cmd, filename, cbk) {
            this.sendJobData(cmd, {filename:filename})

            if (cbk) {
                let key = `${cmd}_${filename}`
                this.once(key, null, cbk)
            }
        }

        //{plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        //data.data {filename:, content:}
        onGetServerFileData(data) {
            let key = `${data.cmd}_${data.data.filename}`
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