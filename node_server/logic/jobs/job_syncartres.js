const JobBase = require("../../framework/jobs/job_base");

class JobSyncArtRes extends JobBase {
    // data: {projName:projName}
    // result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    dealDataAsync(data, result, cbk) {
        console.log(data, result)
        result.data = {projName: data.projName}
        cbk && cbk()
    }
}


module["exports"] = JobSyncArtRes

