
(function (exports) {
    
    class MoniUpdateClient extends MoniBase {
        onSendServerCmd(cmd, data) {
            super.onSendServerCmd(cmd, data)

            // let key = Define.VO.DATA_PROJ_STATUS
            // let voProjStatus = this.getData(key)
            // voProjStatus.setStatus(projName, PROJECT_STATUS.PREPARE)
        }

        // {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        onDealResponseData(result) {
            super.onDealResponseData(result)
            this._updateVoData()
        }

        _updateVoData() {
            let key = Define.VO.DATA_PROJ_STATUS
            let voProjStatus = this.logic.getData(key)
            voProjStatus.updateData()

            this.logic.on(EVT_LOGIC.PROJ_STATUS_UPDATE, this, ()=>{
                if (voProjStatus.isAllDone()) {
                    this.mgr.client.onCmdEnd(this.cmd)
                }
            })

            // this.logic.sendJobCmd(JOB_CODE.STATUS_PROJECT, {}, this._onProjStatusBack, this)
        }

        //data {data:{状态数据 所有项目}}
        // _onProjStatusBack(data) {
        //     let key = Define.VO.DATA_PROJ_STATUS
        //     let voProjStatus = this.logic.getData(key)
            
        //     if (data.projName) {
        //         voProjStatus.setProjStatus(data.projName, data.data)
        //     } else {
        //         voProjStatus.setProjStatusAll(data.data)
        //     }

        //     if (!voProjStatus.isAllDone()) {
        //         this.mgr.timer.once(Define.PROJ_STATUS_UPDATE_INTERVEL, this, this._updateVoData)
        //     } else {
        //         this.mgr.client.onCmdEnd(this.cmd)
        //     }
        // }
    }

    exports.MoniUpdateClient = MoniUpdateClient
   
})(window)

