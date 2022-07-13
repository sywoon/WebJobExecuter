(function (exports) {
    
    class JobProjectStatus extends JobBase {
        dealData(data) {
            logger.log("JobProjectStatus", data)
        }
    }

    exports.JobProjectStatus = JobProjectStatus
   
})(window)
