
(function (exports) {
    
    class JobReadConfigFile extends JobBase {
        //{plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        //data.data {filename:, content:}
        dealData(data) {
            super.dealData(data)
            this.logic.onJobCmdBack(data.cmd, data.data)
        }
    }

    exports.JobReadConfigFile = JobReadConfigFile
   
})(window)
