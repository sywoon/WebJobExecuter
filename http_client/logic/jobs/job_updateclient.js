
(function (exports) {
    
    class JobUpdateClient extends JobBase {
        dealData(data) {
            console.log("JobUpdateClient", data)
        }
    }

    exports.JobUpdateClient = JobUpdateClient
   
})(window)

