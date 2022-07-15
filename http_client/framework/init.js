(function(exports) {
    function InitFramework(cbk) {
        let mgr = new Mgr()
        let syncLoaded = new SyncLoaded(cbk, mgr)

        syncLoaded.addCheck("mgr")
        mgr.initAll(syncLoaded.cbkListener.bind(syncLoaded, "mgr"))
    }

    exports.InitFramework = InitFramework
})(window)