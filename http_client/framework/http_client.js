(function (exports){
    class HttpClient extends EventDispatcher {
        constructor(mgr) {
            super()
            this.mgr = mgr
            let cfgNodeSvr = mgr.toolsCfg.getConfig("node_server")
            this.urlServer = `http://${cfgNodeSvr.ip}:${cfgNodeSvr.port}`
            this.urlWeb = Browser.getBaseUrl()
            this.cmdQueue = []

            this.dealDataCall = null
            this.inRequest = false
            this.xhr = new HttpRequest()
            this.xhr.setCallback(this._onHttpResponse.bind(this))
        }
    
        setDealDataCall(call) {
            this.dealDataCall = call
        }

        // {plugin_type:, cmd:, data:{}}
        onServerBusy(data) {
            this.fire(EVT_HTTP_CLIENT.SERVER_BUSY, data)
        }

        //{plugin_type:number, cmd:string|number, data:{...}}
        send(data) {
            this.pushToQueue(data)
            this._sendNext()
        }

        _filterQueueData(data) {
            let key = data[data.length-1]["__key"]
            if (!key)
                return

            for (let i = data.length-2; i >= 0; i--) {
                if (data[i]["__key"] == key)
                    data.splice(i, 1)
            }
        }

        pushToQueue(data) {
            console.log("push queue", data)
            this.cmdQueue.push(data)
            this._filterQueueData(this.cmdQueue)

            if (this.cmdQueue.length > Define.MAX_QUEUE_LEN) {
                this.cmdQueue.splice(0, this.cmdQueue.length - Define.MAX_QUEUE_LEN)
            }

            this.mgr.timer.once(0, this, ()=> {
                this.fire(EVT_HTTP_CLIENT.DATA_QUEUE_CHG, this.cmdQueue)
            })
        }

        clearQueue() {
            this.cmdQueue = []
        }

        getQueueInfo() {
            return `当前队列数:${this.cmdQueue.length}`
        }

        _sendNext() {
            if (this.inRequest)
                return

            if (this.cmdQueue.length == 0)
                return

            let data = this.cmdQueue.shift()
            this.inRequest = true
            console.log("[[send http]]", data)
            this.xhr.send(this.urlServer, JSON.stringify(data), "post", "json")

            this.mgr.timer.once(0, this, ()=> {
                this.fire(EVT_HTTP_CLIENT.DATA_QUEUE_CHG, this.cmdQueue)
            })
        }

        //{error:0, result:{}}
        //result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        _onHttpResponse(type, data) {
            this.inRequest = false

            if (type == "complete") {
                console.log("[[onHttpResponse]]", data)
                if (data.error == -1) {
                    console.error(data.result.msg)
                } else {
                    if (this.dealDataCall) {
                        this.dealDataCall(data.result)
                    } else {
                        console.log("nobody deal data", data)
                    }
                }
            }

            this._sendNext()
        }
    }

    exports.HttpClient = HttpClient
})(window)