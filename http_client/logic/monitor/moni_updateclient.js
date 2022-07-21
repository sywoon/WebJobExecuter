import {MoniBase} from "./../../framework/jobs/moni_base.js"
import {Define, EVT_LOGIC, JOB_CODE} from "./../../define.js"

export class MoniUpdateClient extends MoniBase {
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
        let endCall = ()=>{
            if (voProjStatus.isStatusDone(projName)) {
                this.mgr.client.onCmdEnd(this.cmd)
                if (result.cmd == JOB_CODE.CMD_UPDATE_CLIENT) {
                    console.log("项目更新结束:" + projName)
                } else if (result.cmd == JOB_CODE.CMD_SYNC_ART_RES) {
                    console.log("资源同步结束:" + projName)
                }
                this.logic.off(EVT_LOGIC.PROJ_STATUS_UPDATE, this, endCall)
            }
        }
        this.logic.on(EVT_LOGIC.PROJ_STATUS_UPDATE, this, endCall)
    }
}

