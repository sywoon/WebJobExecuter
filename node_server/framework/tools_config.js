var fs = require("fs");


class ToolsConfig {
    constructor(rootPath) {
        this.rootPath = rootPath
        this.toolsCfg = {}

        this._loadConfig()
    }

    _loadConfig() {
        let filepath = this.rootPath + "/config/tools_config.json"
        let data = fs.readFileSync(filepath, 'utf-8')
        data = JSON.parse(data)
        this.toolsCfg = data
    }

    getConfig(name) {
        return this.toolsCfg[name]
    }
}


module['exports'] = ToolsConfig