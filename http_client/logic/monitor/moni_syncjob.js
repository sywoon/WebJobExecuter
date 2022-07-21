import {MoniBase} from "./../../framework/jobs/moni_base.js"


export class MoniSyncJob extends MoniBase {
    // {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    onDealResponseData(result) {
        super.onDealResponseData(result)
        this.mgr.client.onCmdEnd(result.cmd)
    }
}

