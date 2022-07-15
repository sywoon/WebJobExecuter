(function(exports) {
    let CMD_JOBSENDER = {
        [JOB_CODE.CMD_UPDATE_CLIENT] : JobUpdateClient,
        [JOB_CODE.CMD_SYNC_ART_RES] : JobSyncArtRes,
    }
    
    let STATUS_JOBSENDER = {
        [JOB_CODE.STATUS_PROJECT] : JobProjectStatus,
    }
    
    let FILE_JOBSENDER = {
        [JOB_CODE.FILE_READ_CONFIG] : JobReadConfigFile,
    }

    class Logic extends EventDispatcher {
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
            let key = Define.VO.DATA_PROJ_STATUS
            let vo = this.getData(key)
            vo.updateData()
        }

        getJobSender(key) {
            return this.jobs[key]
        }

        sendJobCmd(cmd, data) {
            let job = this.getJobSender(cmd)
            job.sendServerCmd(data)
        }

        sendJobCmdStatus(cmd, data, cbk) {
            this.sendJobCmd(cmd, data)
            if (cbk) {
                this.once(cmd, null, cbk)
            }
        }

        onJobCmdStatusBack(cmd, data) {
            this.fire(cmd, data)
        }

        sendJobCmdFile(cmd, filename, cbk) {
            this.sendJobCmd(cmd, {filename:filename})

            if (cbk) {
                let key = `${cmd}_${filename}`
                this.once(key, null, cbk)
            }
        }

        // {filename:, content:}
        onJobCmdFileBack(cmd, data) {
            let key = `${cmd}_${data.filename}`
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
                let sender = new senders[key](key, type, this)
                pluginMgr.registerJobSender(type, key, sender)
                this.jobs[key] = sender
            }
        }


        // {projName:projName}
        onSyncArtResBack(data) {
            logic.fire(EVT_LOGIC.SYNC_ART_RES, data)
        }

        // {projName:projName}
        onUpdateClientBack(data) {

        }
    }

    exports.Logic = Logic
})(window)