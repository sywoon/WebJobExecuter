const JobBase = require("../../framework/jobs/job_base")
const logger = require("../../framework/libs/logger")

class JobUpdateClient extends JobBase {
    dealDataAsync(data, result, cbk) {
        logger.log("JobUpdateClient", data, result)
        cbk && cbk()
    }
}


module["exports"] = JobUpdateClient