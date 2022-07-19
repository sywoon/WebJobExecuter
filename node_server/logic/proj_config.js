var fs = require("fs");
const Utils = require("../framework/utils");


class ProjConfig {
    constructor(rootPath) {
        this.rootPath = rootPath
        this.projCfg = {}

        this._loadConfig()
    }

    _loadConfig() {
        let filepath = this.rootPath + "/config/project_config.json"
        let data = fs.readFileSync(filepath, 'utf-8')
        data = JSON.parse(data)
        this.projCfg = data

        let projRootPath = this.projCfg["projRootPath"]
        if (!projRootPath.match("^%w:")) {  //相对路径  d:/ e:/
            projRootPath = this.rootPath + "/" + projRootPath
        }
        this.projRootPath = Utils.fixPath(projRootPath, true)
    }

    getToolRootPath() {
        return this.rootPath
    }

    getConfig(name) {
        return this.projCfg[name]
    }

    getProjects() {
        return this.projCfg["projects"]
    }

    getCommonCfg() {
        return this.projCfg["commonCfg"]
    }

    getProjectPath(projName) {
        for (let cfg of this.projCfg["projects"]) {
            if (cfg.name === projName) {
                return Utils.fixPath(this.projRootPath + "/" + cfg.path, true)
            }
        }
        return null
    }

    getProjectBranch(projName) {
        for (let cfg of this.projCfg["projects"]) {
            if (cfg.name === projName) {
                return cfg.gitBranch
            }
        }
        return null
    }
}


module['exports'] = ProjConfig