import {EventDispatcher} from "./libs/event_dispatcher.js"
import {Browser} from "./libs/browser.js"
import {HttpRequest} from "./libs/http_request.js"
import {Define, ASYNC_JOB, EVT_HTTP_CLIENT} from "./../define.js"

export class HttpClient extends EventDispatcher {
    constructor(mgr) {
        super()
        this.mgr = mgr
        let cfgNodeSvr = mgr.toolsCfg.getConfig("node_server")
        this.urlServer = `http://${cfgNodeSvr.ip}:${cfgNodeSvr.port}`
        this.urlWeb = Browser.getBaseUrl()
        this.cmdQueue = []
        this.cmdQueueASync = []
        this.lastSendSync = true

        this.dealDataCall = null
        this.inRequest = false
        this.xhr = new HttpRequest()
        this.xhr.setCallback(this._onHttpResponse.bind(this))
    }

    _log(...msgs) {
        if (!this.mgr.isAdmin())
            return
        console.log(...msgs)
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
        this._sendNext(true)  //异步任务的限制 业务自己完成 这里都算能执行
    }

    onCmdEnd(cmd) {
        this._sendNext(ASYNC_JOB[cmd])
    }

    _filterSameCmd(queue) {
        if (queue.length == 0)
            return
        let key = queue[queue.length-1]["__key"]
        if (!key)
            return

        for (let i = queue.length-2; i >= 0; i--) {
            if (queue[i]["__key"] == key)
                queue.splice(i, 1)
        }
    }

    _limitQueueCount(queue) {
        if (queue.length > Define.MAX_QUEUE_LEN) {
            queue.splice(0, queue.length - Define.MAX_QUEUE_LEN)
        }
    }

    pushToQueue(data) {
        if (ASYNC_JOB[data.cmd]) {
            this.cmdQueueASync.push(data)
        } else {
            this.cmdQueue.push(data)
        }

        this._filterSameCmd(this.cmdQueueASync)
        this._filterSameCmd(this.cmdQueue)
        this._limitQueueCount(this.cmdQueueASync)
        this._limitQueueCount(this.cmdQueue)
    }

    getQueueInfo() {
        return `当前队列数:${this.cmdQueue.length}`
    }

    _getNextCmdData(canAsync) {
        if (this.cmdQueue.length == 0 && this.cmdQueueASync.length == 0)
            return null

        if (!canAsync) {
            if (this.cmdQueue.length == 0)
                return null
            return this.cmdQueue.shift()
        }

        //交替发送
        let data = null
        if (this.cmdQueue.length>0 && this.cmdQueueASync.length>0) {
            data = this.lastSendSync ? this.cmdQueueASync.shift() : this.cmdQueue.shift()
        }
        if (!data) {
            if (this.cmdQueue.length > 0) {
                data = this.cmdQueue.shift()
            } else if (this.cmdQueueASync.length > 0) {
                data = this.cmdQueueASync.shift()
            }
        }
        this.lastSendSync = !this.lastSendSync
        return data
    }

    _sendNext(canAsync) {
        if (this.inRequest)
            return

        let data = this._getNextCmdData(canAsync)
        if (!data)
            return

        this.inRequest = true
        this._log("[[send http]]", data)
        this.xhr.send(this.urlServer, JSON.stringify(data), "post", "json")

        this.fire(EVT_HTTP_CLIENT.DATA_QUEUE_CHG, this.cmdQueue, this.cmdQueueASync)
    }

    //{error:0, result:{}}
    //result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    _onHttpResponse(type, data) {
        this.inRequest = false
        if (type == "complete") {
            this._log("[[onHttpResponse]]", data)
            if (data.error == -1) {
                console.error(data.result.msg)
            } else {
                if (this.dealDataCall) {
                    this.dealDataCall(data.result)
                } else {
                    this._log("nobody deal data", data)
                }
            }
        }
    }
}