const JobBase = require("../../framework/jobs/job_base");
const logger = require ("./../../framework/logger")


class JobProjectStatus extends JobBase {
    dealData(data, result, cbk) {
        logger.log("JobProjectStatus", data, result)
        cbk && cbk()
    }
}


module["exports"] = JobProjectStatus