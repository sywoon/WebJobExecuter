(function(exports) {
    function InitFramework(cbk) {
        let syncLoaded = new SyncLoaded(cbk)
        
        let mgr = new Mgr()
        syncLoaded.addCheck("mgr")
        mgr.initAll(syncLoaded.cbkListener.bind(syncLoaded, "mgr"))
        window.mgr = mgr
    }

    exports.InitFramework = InitFramework
})(window)