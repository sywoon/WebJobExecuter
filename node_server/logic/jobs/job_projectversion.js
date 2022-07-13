const JobBase = require("../../framework/jobs/job_base");
const logger = require ("../../framework/libs/logger")

class JobProjectVersion extends JobBase {
    dealData(data, result) {
        logger.log("JobProjectVersion", data, result)
    }
}


module["exports"] = JobProjectVersion