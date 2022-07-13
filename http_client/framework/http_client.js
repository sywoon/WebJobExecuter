(function (exports){
    class HttpClient {
        constructor() {
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
            this.cmdQueue.push(data)
            this._sendNext()
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
                console.error("load config failed tools_config.json")
                this.inRequest = false
            } else if (type == "complete") {
                console.log("load tools_config.json", data)
                if (data.error == -1) {
                    console.error(data.result.msg)
                } else {
                    if (that.dealDataCall) {
                        that.dealDataCall(data.result)
                    } else {
                        console.log("nobody deal data", data)
                    }
                }
                this.inRequest = false
            }
        }
    }

    exports.HttpClient = HttpClient
})(window)