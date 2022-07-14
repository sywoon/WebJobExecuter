
(function (exports) {
    
    class JobSyncArtRes extends JobBase {
        dealData(data) {
            console.log("JobSyncArtRes", data)
        }
    }

    exports.JobSyncArtRes = JobSyncArtRes
   
})(window)

