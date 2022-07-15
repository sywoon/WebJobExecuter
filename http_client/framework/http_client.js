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

        //{plugin_type:number, cmd:string|number, data:{...}}
        send(data) {
            console.log("[[send http]]", data)
            this.pushToQueue(data)
            this._sendNext()
        }

        pushToQueue(data) {
            this.cmdQueue.push(data)

            if (this.cmdQueue.length > Define.MAX_QUEUE_LEN) {
                this.cmdQueue.splice(0, this.cmdQueue.length - Define.MAX_QUEUE_LEN)
            }

            this.mgr.timer.once(100, this, ()=> {
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
            this.xhr.send(this.urlServer, JSON.stringify(data), "post", "json")
        }

        //{error:0, result:{}}
        //result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
        _onHttpResponse(type, data) {
            if (type == "onerror") {
                this.inRequest = false
            } else if (type == "complete") {
                console.log("[[onHttpResponse]]", data)
                this.inRequest = false
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
        }
    }

    exports.HttpClient = HttpClient
})(window)