
(function (exports) {
    
    class MoniSyncJob extends MoniBase {
        // {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        onDealResponseData(result) {
            super.onDealResponseData(result)
            this.mgr.client.onCmdEnd(result.cmd)
        }
    }

    exports.MoniSyncJob = MoniSyncJob
   
})(window)

