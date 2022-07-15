
(function (exports) {
    
    class JobUpdateClient extends JobBase {
        //{plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        //data.data {projName:projName}
        dealData(data) {
            console.log("JobUpdateClient", data)
            this.logic.onUpdateClientBack(data.data)
        }
    }

    exports.JobUpdateClient = JobUpdateClient
   
})(window)

