
(function (exports) {
    
    class JobUpdateClient extends JobBase {
        dealData(data) {
            logger.log("JobUpdateClient", data)
        }
    }

    exports.JobUpdateClient = JobUpdateClient
   
})(window)

