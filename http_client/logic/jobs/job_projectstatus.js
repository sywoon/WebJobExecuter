(function (exports) {
    
    class JobProjectStatus extends JobBase {
        dealData(data) {
            console.log("JobProjectStatus", data)
        }
    }

    exports.JobProjectStatus = JobProjectStatus
   
})(window)
