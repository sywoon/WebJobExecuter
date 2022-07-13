const JobBase = require("../../framework/jobs/job_base");

class JobSyncArtRes extends JobBase {
    dealDataAsync(data, result, cbk) {
        logger.log("JobSyncArtRes", data, result)
        cbk && cbk()
    }
}


module["exports"] = JobSyncArtRes

