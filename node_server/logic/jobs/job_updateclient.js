const JobBase = require("../../framework/jobs/job_base")
const logger = require("./../../framework/logger")

class JobUpdateClient extends JobBase {
    dealData(data, result, cbk) {
        logger.log("JobUpdateClient", data, result)
        cbk && cbk()
    }
}


module["exports"] = JobUpdateClient