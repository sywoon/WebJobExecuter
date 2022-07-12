
(function (exports) {
    class ToolsConfig {
        constructor(cbk) {
            this.baseUrl = Browser.getBaseUrl()
            this.xhr = new HttpRequest()
            this.xhr.setCallback(this._onHttpResponse.bind(this))
            this._loadConfig()
            this._initCbk = cbk
        }

        _loadConfig() {
            let url = "/config/tools_config.json"
            this.xhr.send(url, "", "get", "json")
        }

        _onHttpResponse(type, data) {
            if (type == "onerror") {
                console.error("load config failed tools_config.json")
            } else if (type == "complete") {
                console.log("load tools_config.json", data)
                this.toolsCfg = data
                this._initCbk && this._initCbk()
            }
        }

        getConfig(name) {
            return this.toolsCfg[name]
        }
    }

    exports.ToolsConfig = ToolsConfig
})(window)