
class ResponseOperator {
    constructor(nodeSvr, pluginMgr) {
        this.nodeSvr = nodeSvr
        this.pluginMgr = pluginMgr
    }

    onReceiveClientData(response, buffer) {
        let responseBack = (code, data, msg)=> {
            this.nodeSvr.responseBack(response, code, data, msg)
        }

        let data
        try {
            data = JSON.parse(buffer)
            this.pluginMgr.dealResponseData(data, responseBack)
        } catch (error) {
            let msg = "error! json data parse error:" + data
            console.error(msg)
            responseBack(-1, null, msg)
            return
        }
    }
}


module['exports'] = ResponseOperator
