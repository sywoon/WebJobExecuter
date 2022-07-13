
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
            this.mgr.plugin.dealResponseData(data, responseBack)
        } catch (error) {
            let msg = "error! json data parse error:" + data
            console.error(msg)
            responseBack(-1, 0, null, msg)
            return
        }
    }
}


module['exports'] = ResponseOperator
