
(function (exports) {
    
    class JobSyncArtRes extends JobBase {
        //{plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        //data.data {projName:projName}
        dealData(data) {
            this.logic.onSyncArtResBack(data.cmd, data.data)
        }
    }

    exports.JobSyncArtRes = JobSyncArtRes
   
})(window)

