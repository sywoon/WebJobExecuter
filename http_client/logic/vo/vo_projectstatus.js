
(function (exports) {
    class ProjectStatusVo {
        constructor(logic) {
            this.logic = logic
            this.mgr = logic.mgr
            this.projStatusAll = {}
        }

        updateData() {
            this.logic.sendJobCmdStatus(JOB_CODE.STATUS_PROJECT, {}, this._onProjStatusBack.bind(this))
        }

        //data {projName:, data:{状态数据 某一个}}
        //data {data:{状态数据 所有项目}}
        _onProjStatusBack(data) {
            if (data.projName) {
                this.setProjStatus(data.projName, data.data)
            } else {
                this.setProjStatusAll(data.data)
            }
            this.logic.fire(EVT_LOGIC.PROJ_STATUS_UPDATE, this)
        }

        // "master":{"errMsg":"","status":0,"startTime":1647500026000,"lastUpdateTime":1647500075000}
        getProjStatus(projName) {
            return this.projStatusAll[projName] || {}
        }

        getProjStatusAll() {
            return this.projStatusAll
        }

        setProjStatus(projName, data) {
            this.projStatusAll[projName] = data
            this.writeConfig(this.projStatusAll)
        }

        setProjStatusAll(data) {
            this.projStatusAll = data
        }
    }

    exports.ProjectStatusVo = ProjectStatusVo

})(window)