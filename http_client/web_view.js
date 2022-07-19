(function (exports) {
    class WebView {
        constructor(mgr, logic, client) {
            this.mgr = mgr
            this.logic = logic
            this.client = client
            this.waitCmdQueue = []
        }

        refreshView() {
            let filename = "project_config.json"
            this.logic.sendJobCmd(JOB_CODE.FILE_READ_CONFIG, {filename:filename}, this._onAllProjects, this)
        }

        _onElementCreated() {
            this.client.on(EVT_HTTP_CLIENT.DATA_QUEUE_CHG, this, this._onCmdQueueChg)
            this.client.on(EVT_HTTP_CLIENT.SERVER_BUSY, this, this._onServerBusy)
            
            this.logic.on(EVT_LOGIC.PROJ_STATUS_UPDATE, this, this._onProjStatusUpdate)

            this.logic.updateVoData()
        }

        // {filename,content}
        _onAllProjects(data) {
            let content = JSON.parse(data.content)
            if (!content) {
                console.error("parse json failed")
                return
            }
            let projects = content["projects"]
            let btns = [
                ["更新", this._onBtnUpdateProject.bind(this)],
                ["同步资源", this._onBtnSyncResource.bind(this)],
                ["状态重置", this._onBtnResetStatus.bind(this)],
            ]
            this._createProjectsItems(projects, btns)

            // this.refreshProjectStatus() --废弃 改为通过内存状态方式
            this._onElementCreated()
        }

        _onCmdQueueChg(queue) {
            // let strs = []
            // strs.push("等待命令数:" + queue.length)
            // // [{"plugin_type":"FILE","cmd":"file_read_config","data":{"filename":"update_dynamic_status.json"}}]
            // for (let info of queue) {
            //     strs.push(JSON.stringify(info))
            // }

            // this.setStatusText(strs.join("\n"))
        }

        _onServerBusy(data) {
            console.log("服务器繁忙，自动刷新", data)
            //服务器在处理其他业务 重新刷新项目状态数据
            this.addWaitCmd(data.cmd, data.data, data.data.projName)
            this.logic.updateVoProjStatus()
        }

        _onProjStatusUpdate(voProjStatus) {
            let all = voProjStatus.getProjStatusAll()
            for (let projName in all) {
                let dataProj = all[projName]
                if (this.isProjInLock(projName))
                    continue
                this._updateProjStatusText(projName, dataProj)
            }

            this._filterQueueByStatus(all)

            if (this.waitCmdQueue.length>0) {
                if (voProjStatus.isAllDone()) {
                    let info = this.waitCmdQueue.shift()
                    this.logic.sendJobCmd(info.cmd, info.data)
                    this._updateWaitCmdText()
                }
            }
        }

        _onBtnUpdateProject(projName) {
            let key = Define.VO.DATA_PROJ_STATUS
            let voProjStatus = this.logic.getData(key)
            if (!voProjStatus.isStatusDone(projName) || this.isProjInLock(projName)) {
                alert("正在执行中，请稍后再试")
                return
            }

            if (!voProjStatus.isAllDone()) {
                this.addWaitCmd(JOB_CODE.CMD_UPDATE_CLIENT, {projName:projName}, projName)
                this.setStatusText("等待中...", projName)
                return
            }
            
            voProjStatus.setStatus(projName, PROJECT_STATUS.PREPARE)
            this.logic.sendJobCmd(JOB_CODE.CMD_UPDATE_CLIENT, {projName:projName})
            this.setStatusText("准备开始...", projName)
        }

        _onBtnSyncResource(projName) {
            let key = Define.VO.DATA_PROJ_STATUS
            let voProjStatus = this.logic.getData(key)
            if (!voProjStatus.isStatusDone(projName) || this.isProjInLock(projName)) {
                alert("正在执行中，请稍后再试")
                return
            }

            if (!voProjStatus.isAllDone()) {
                this.addWaitCmd(JOB_CODE.CMD_SYNC_ART_RES, {projName:projName}, projName)
                this.setStatusText("等待中...", projName)
                return
            }

            voProjStatus.setStatus(projName, PROJECT_STATUS.PREPARE)
            this.logic.sendJobCmd(JOB_CODE.CMD_SYNC_ART_RES, {projName:projName})
            this.setStatusText("准备开始...", projName)
        }
        
        _onBtnResetStatus(projName) {
            this.logic.sendJobCmd(JOB_CODE.STATUS_RESET_STATUS, {projName:projName})
        }


        
        //通过文件方式 获取项目状态   --废弃 改为通过内存状态方式
        // refreshProjectStatus() {
        //     let filename = "update_dynamic_status.json"
        //     this.logic.sendJobCmdFile(JOB_CODE.FILE_READ_CONFIG, filename, this._onGetProjectStatus, this)
        // }

        // {filename:, content:}
        // _onGetProjectStatus(data) {
        //     let content = JSON.parse(data.content)
        //     if (!content) {
        //         console.error("parse json failed")
        //         return
        //     }

        //     for (let projName in content) {
        //         let dataProj = content[projName]
        //         this._updateProjStatusText(projName, dataProj)
        //     }
        // }

        
        _updateProjStatusText(projName, data) {
            // console.log("_updateProjStatusText", projName, data)
            let timeMsg
            if (data.status == PROJECT_STATUS.NONE || data.status == PROJECT_STATUS.ERROR) {
                let dateLast = new Date(Number(data.lastUpdateTime || data.startTime))
                timeMsg = "结束时间: " + dateLast.toLocaleString()
            } else {
                let date = new Date(Number(data.startTime))
                timeMsg = "开始时间: " + date.toLocaleString()
            }

            let str = ""
            switch (data.status) {
                case PROJECT_STATUS.NONE:
                    break
                case PROJECT_STATUS.PREPARE:
                    str = "准备开始..."
                    break
                case PROJECT_STATUS.EXPORT_PROTOL:
                    str = "更新协议中..."
                    break
                case PROJECT_STATUS.EXPORT_EXCEL:
                    str = "导出excel中..."
                    break
                case PROJECT_STATUS.EXPORT_UI:
                    str = "导出UI中..."
                    break
                case PROJECT_STATUS.COMPILE_CLIENT:
                    str = "编译客户端中..."
                    break
                case PROJECT_STATUS.SYNC_ART_RES:
                    str = "同步资源中..."
                    break
                case PROJECT_STATUS.ERROR:
                    {
                        let idx = data.errMsg.indexOf(":")
                        let sub = data.errMsg
                        if (idx > 0) {
                            sub = data.errMsg.substr(0, idx)
                        }

                        str = "处理失败:" + sub + " 详细log查看控制台"
                        console.error(data.errMsg)
                    }
                    break
                default:
                    break
            }
            this.setStatusText(timeMsg + "\n" + str, projName)
        }

        setStatusText(str, projName) {
            if (!this.msgLabels)  //还未初始化
                return;
            if (projName) {
                this.msgLabels[projName].innerHTML = str
                return;
            }

            this.msgLabels["lblCommon"].innerHTML = str
        }

        
        _createElement(type, parent) {
            let e = document.createElement(type);
            if (parent) {
                parent.appendChild(e);
            }
            return e;
        }

        _br(parent, count=1) {
            for (let i = 0; i<count; i++) {
                parent.appendChild(document.createElement("br"));
            }
        }

        _createProjectsItems(projsData, btns) {
            let projsCfg = {}
            let msgLabels = {}

            let divProjRoot = document.getElementById("divProjRoot")
            let lblCommon = this._createElement("label", divProjRoot)
            msgLabels["lblCommon"] = lblCommon

            this._br(divProjRoot)

            let urlBase = Browser.getBaseUrl()
            for (let proj of projsData) {
                let projName = proj.name
                projsCfg[projName] = proj

                let projDiv = this._createElement("div", divProjRoot)

                let link = this._createElement("a", projDiv)
                // "http://192.168.88.252:9001"
                link.href = urlBase + proj.httpPath
                link.target = "_blank"
                link.style = "font-size: 30px;"
                link.innerText = projName

                this._br(projDiv, 1);
                // let title = this._createElement("h3", projDiv)
                // title.innerText = proj.name;

                for (let cfg of btns) {
                    let btn = this._createElement("button", projDiv)
                    btn.style="height: 30px; width: 140px; font-size: 20px;"
                    btn.innerText = cfg[0]
                    btn.onclick = ()=> {
                        cfg[1](projName)
                    }
                }

                this._br(projDiv, 1)
                let msg = this._createElement("label", projDiv)
                msgLabels[projName] = msg

                this._br(projDiv, 2)
            }
            this.projsCfg = projsCfg
            this.msgLabels = msgLabels
        }


        //队列相关=======================
        addWaitCmd(cmd, data, lockProject) {
            this.waitCmdQueue.push({cmd:cmd, data:data, lockProject:lockProject})
            this._updateWaitCmdText()
        }

        _filterQueueByStatus(allStatus) {
            for (let projName in allStatus) {
                let dataProj = allStatus[projName]
                if (dataProj.status != PROJECT_STATUS.NONE) {
                    this._removeWaitCmd(projName)
                }
            }
        }

        _removeWaitCmd(projName) {
            let find = false
            for (let i = 0; i < this.waitCmdQueue.length; i++) {
                let info = this.waitCmdQueue[i]
                if (info.lockProject == projName) {
                    this.waitCmdQueue.splice(i, 1)
                    find = true
                    break
                }
            }
            find && this._updateWaitCmdText()
        }

        _updateWaitCmdText() {
            if (this.waitCmdQueue.length == 0) {
                this.setStatusText("")
                return
            }
             
            let strs = []
            strs.push("等待执行:" + this.waitCmdQueue.length)
            for (let info of this.waitCmdQueue) {
                if (info.cmd == JOB_CODE.CMD_UPDATE_CLIENT) {
                    strs.push("更新项目：" + info.lockProject)
                } else if (info.cmd == JOB_CODE.CMD_SYNC_ART_RES) {
                    strs.push("同步资源：" + info.lockProject)
                }
            }
            this.setStatusText(strs.join("<br/>"))
        }

        isProjInLock(projName) {
            for (let info of this.waitCmdQueue) {
                if (info.lockProject == projName)
                    return true
            }
            return false
        }
    }
   
    exports.WebView = WebView
})(window);

