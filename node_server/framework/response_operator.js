
class ResponseOperator {
    constructor(nodeSvr, mgr) {
        this.nodeSvr = nodeSvr
        this.mgr = mgr
    }

    onReceiveClientData(response, buffer) {
        let responseBack = (code, data, msg)=> {
            this.nodeSvr.responseBack(response, code, data, msg)
        }

        //{plugin_type:number, cmd:string|number, data:{...}}
        let data
        try {
            data = JSON.parse(buffer)
        } catch (error) {
            let msg = "error! json data parse error:" + buffer
            console.error(msg)
            responseBack(-1, 0, null, msg)
            return
        }

        this.mgr.plugin.dealResponseData(data, responseBack)
    }
}


module['exports'] = ResponseOperator
