const JobBase = require("../../framework/jobs/job_base")
const logger = require("../../framework/libs/logger")

class JobUpdateClient extends JobBase {
    // data: {projName:projName}
    // result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    dealDataAsync(data, result, cbk) {
        logger.log("JobUpdateClient", data, result)
        cbk && cbk()
    }
}


module["exports"] = JobUpdateClient