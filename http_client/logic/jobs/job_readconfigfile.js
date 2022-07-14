
(function (exports) {
    
    class JobReadConfigFile extends JobBase {
        //{plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        //data.data {filename:, content:}
        dealData(data) {
            logic.onGetServerFileData(data)
        }
    }

    exports.JobReadConfigFile = JobReadConfigFile
   
})(window)
