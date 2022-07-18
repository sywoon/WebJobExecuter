const Define = require ("../../define")

const PROJECT_STATUS = Define.PROJECT_STATUS
const PLUGIN_TYPE = Define.PLUGIN_TYPE



class ProjectStatusVo {
    constructor(logic) {
        this.logic = logic
        this.mgr = logic.mgr
        this.projStatusAll = {}

        this._init()
    }

    //没有数据 表示还未操作过
    isStatusDone(projName) {
        let cfg = this.projStatusAll[projName] || {status:PROJECT_STATUS.NONE}
        return cfg.status == PROJECT_STATUS.NONE
    }

    isAllDone() {
        let isDone = true
        for (let projName in this.projStatusAll) {
            let cfg = this.projStatusAll[projName]
            if (cfg.status != PROJECT_STATUS.NONE) {
                isDone = false
                break
            }
        }
        return isDone
    }

    _init() {
        this.updateProjStatusFromFile()
    }

    updateProjStatusFromFile() {
        let data = this.readConfig()
        this.projStatusAll = data
    }

    getProjStatus(projName) {
        return this.projStatusAll[projName] || {}
    }

    getProjStatusAll() {
        return this.projStatusAll
    }

    setProjStatus(projName, data) {
        this.projStatusAll[projName] = data
        this.writeConfig(this.projStatusAll)
    }
    

    // "master":{"errMsg":"","status":0,"startTime":1647500026000,"lastUpdateTime":1647500075000}
    readConfig() {
        let plugin = this.mgr.plugin.getPlugin(PLUGIN_TYPE.FILE)
        let path = "./../config/update_dynamic_status.json"
        let content = plugin.readFileSync(path)
        let data
        try {
            data = JSON.parse(content)
        } catch (error) {
            data = {}
            plugin.writeFileSync(path, {})  //覆盖错误的内容
        }
        return data
    }

    writeConfig(data) {
        let plugin = this.mgr.plugin.getPlugin(PLUGIN_TYPE.FILE)
        let path = "./../config/update_dynamic_status.json"
        plugin.writeFileSync(path, data)
    }
}


module["exports"] = ProjectStatusVo

