
(function (exports) {
    
    class JobReadConfigFile extends JobBase {
        //{plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        //data.data {filename:, content:}
        dealData(data) {
            let key = `${this.cmd}_${data.data.filename}`
            logic.fire(key, data)
        }
    }

    exports.JobReadConfigFile = JobReadConfigFile
   
})(window)
