
(function (exports) {
    
    class JobProjectVersion extends JobBase {
        dealData(data) {
            logger.log("JobProjectVersion", data)
        }
    }

    exports.JobProjectVersion = JobProjectVersion
   
})(window)
