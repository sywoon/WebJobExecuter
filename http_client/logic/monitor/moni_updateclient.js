
(function (exports) {
    
    class MoniUpdateClient extends MoniBase {
        onSendServerCmd(cmd, data) {
            super.onSendServerCmd(cmd, data)
        }

        // {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        onDealResponseData(result) {
            super.onDealResponseData(result)
            this._updateVoData(result)
        }

        _updateVoData(result) {
            let key = Define.VO.DATA_PROJ_STATUS
            let voProjStatus = this.logic.getData(key)
            voProjStatus.updateData()

            let projName = result.data.projName
            this.logic.on(EVT_LOGIC.PROJ_STATUS_UPDATE, this, ()=>{
                if (voProjStatus.isStatusDone(projName)) {
                    this.mgr.client.onCmdEnd(this.cmd)
                }
            })
        }
    }

    exports.MoniUpdateClient = MoniUpdateClient
   
})(window)

