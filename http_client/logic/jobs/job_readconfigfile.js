import {JobBase} from "./../../framework/jobs/job_base.js"

export class JobReadConfigFile extends JobBase {
    //{plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    //data.data {filename:, content:}
    dealData(data) {
        super.dealData(data)
        this.logic.onJobCmdBack(data.cmd, data.data)
    }
}

