const JobBase = require("../../framework/jobs/job_base");
const logger = require ("../../framework/libs/logger")


class JobProjectStatus extends JobBase {
    dealData(data, result) {
        logger.log("JobProjectStatus", data, result)
    }
}


module["exports"] = JobProjectStatus