
(function (exports) {
    
    class JobProjectVersion extends JobBase {
        dealData(data) {
            console.log("JobProjectVersion", data)
        }
    }

    exports.JobProjectVersion = JobProjectVersion
   
})(window)
