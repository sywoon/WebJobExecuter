import {InitFramework} from "./framework/init.js"
import {Logic} from "./logic/logic.js"
import {HttpClient} from "./framework/http_client.js"
import {WebView} from "./web_view.js"

class Main {
    constructor() {
        InitFramework((mgr)=>{
            let logic = new Logic(mgr)
            logic.registerAll()
        
            let pluginMgr = mgr.plugin
            let client = new HttpClient(mgr)
            mgr.client = client
            client.setDealDataCall(pluginMgr.dealResponseData.bind(pluginMgr))
            pluginMgr.setServerSendCall(client.send.bind(client))
            pluginMgr.setServerBusyCall(client.onServerBusy.bind(client))
        
            let webView = new WebView(mgr, logic, client)
            webView.refreshView()
        })
    }
}

new Main()




