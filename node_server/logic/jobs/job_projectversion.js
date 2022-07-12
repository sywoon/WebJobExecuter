const JobBase = require("../../framework/jobs/job_base");
const logger = require ("./../../framework/logger")

class JobProjectVersion extends JobBase {
    dealData(data, result, cbk) {
        logger.log("JobProjectVersion", data, result)
        cbk && cbk()
    }
}


module["exports"] = JobProjectVersion