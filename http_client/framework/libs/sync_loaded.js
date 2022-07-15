(function(exports) {
    class SyncLoaded {
        constructor(allCbk, ...params) {
            this.records = {}
            this.allCbk = allCbk
            this.params = params
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
            this.allCbk && this.allCbk.apply(null, this.params || [])
        }
    }
    exports.SyncLoaded = SyncLoaded
})(window)