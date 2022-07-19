(function () {
    
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
   
})();



