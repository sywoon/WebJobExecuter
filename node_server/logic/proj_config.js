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

    removeProjectGitVersion(projName) {
        let filepath = this.rootPath + "/config/project_config_dynamic.json"
        let data = fs.readFileSync(filepath, 'utf-8')
        try {
            data = JSON.parse(data)
        } catch (e) {
            data = {}
            fs.writeFileSync(filepath, "{}")
            return
        }

        delete data[projName]
        fs.writeFileSync(filepath, JSON.stringify(data))
    }
}


module['exports'] = ProjConfig