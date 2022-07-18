(function(exports) {
    class MoniBase {
        constructor(job) {
            this.owner = job
            this.logic = job.logic
            this.mgr = job.logic.mgr
            this.cmd = job.cmd
        }

        onSendServerCmd(cmd, data) {}
        onDealResponseData(result) {}
    }
    
    exports.MoniBase = MoniBase
})(window)


