(function(exports) {
    let CMD_JOBSENDER = {
        [JOB_CODE.CMD_UPDATE_CLIENT] : JobUpdateClient,
        [JOB_CODE.CMD_SYNC_ART_RES] : JobSyncArtRes,
    }
    
    let STATUS_JOBSENDER = {
        [JOB_CODE.STATUS_PROJECT] : JobProjectStatus,
        [JOB_CODE.STATUS_RESET_STATUS] : JobProjectStatus,
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

        sendJobCmd(cmd, data, cbk) {
            let job = this.getJobSender(cmd)
            data.__key = this.makeUniqueKey(cmd, data)
            job.sendServerCmd(data)
            if (cbk) {
                this.once(data.__key, null, cbk)
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
                let sender = new senders[key](cmd, type, this)
                pluginMgr.registerJobSender(type, key, sender)
                this.jobs[key] = sender
            }
        }


        // {projName:projName}
        onUpdateClientBack(data) {

        }
    }

    exports.Logic = Logic
})(window)