(function(exports) {
    class SyncLoaded {
        constructor(allCbk) {
            this.records = {}
            this.allCbk = allCbk
        }

        addCheck(name) {
            this.records[name] = false
        }

        cbkListener(name) {
            this.records[name] = true
            this._checkAll()
        }

        _checkAll() {
            for (let name in this.records) {
                if (!this.records[name])
                    return
            }
            this.allCbk && this.allCbk()
        }
    }
    exports.SyncLoaded = SyncLoaded
})(window)