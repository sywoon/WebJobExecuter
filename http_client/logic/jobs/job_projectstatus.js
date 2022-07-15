(function (exports) {
    
    class JobProjectStatus extends JobBase {
        //{plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        //data.data {projName:, data:{状态数据 某一个}}
        //data.data {data:{状态数据 所有项目}}
        // {"errMsg":"","status":0,"startTime":1647500026000,"lastUpdateTime":1647500075000}
        dealData(data) {
            this.logic.onJobCmdBack(data.cmd, data.data)
        }
    }

    exports.JobProjectStatus = JobProjectStatus
   
})(window)
