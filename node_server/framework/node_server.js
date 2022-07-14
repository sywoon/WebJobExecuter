let http = require('http')

//access to XMLHttpRequest at 'http://127.0.0.1:1025/' from origin 'null' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'http://127.0.0.1:8000' that is not equal to the supplied origin.
let HEAD = {
    // 'Content-Type': 'text/plain',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
    // 'Access-Control-Allow-Origin': `http://${ip}:${port}`
}

let debug = true


class NodeServer {
    constructor() {
        this._dealDataCall = null
    }

    setDealDataCall(call) {
        this._dealDataCall = call
    }

    startServer(ip, port) {
        let that = this
        let server = http.createServer(function (request, response) {
            const {url, method, headers} = request
        
            //console.log('\n收到请求:', url, method, headers)
            debug && console.log(`\n收到请求 url:${url} ${method} host:${headers.host}`)
            debug && console.log(`client ip:${request.socket.remoteAddress} port:${request.socket.remotePort}\n`)
        
            let buffer = ''
            request.on('error', (err) => {
                console.error("request error:" + err)
                response.statusCode = 400
                response.end()
              })
        
            response.on('error', (err) => {
                console.error("response error:" + err)
                response.end()
            })
        
            request.on('data', function (chunk) {
                buffer += chunk
            })
        
            request.on('end', function () {
                //{"cmd":1,"data":{"data":1,"msg":"update_excel"}}
                debug && console.log("request received data:" + buffer, typeof(buffer))
                response.setHeader('Access-Control-Allow-Origin', '*')
                response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
                response.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization')
        
                if (that._dealDataCall) {
                    that._dealDataCall(response, buffer)
                } else {
                    that.responseBack(response, -1, {msg:"nobody deal data"})
                }
            })
        })
        
        server.listen(port, ()=> {
            console.log(`server started at ${ip}:${port}.`)
        })
    }

    // error:系统级  0正常 -1:数据未获得正确处理
    // code:业务级
    // result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    responseBack(response, error, result) {
        let o = {error:error, result}
        let str = JSON.stringify(o)

        response.writeHead(200, HEAD)  //501:not implemented
        response.end(str)

        debug && console.log(`responseBack:${str}`)
    }
}

module['exports'] = NodeServer