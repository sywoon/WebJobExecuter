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
        let status = this.projStatusAll[projName].status
        if (!status)  //没有数据 表示还未操作过
            return true
        
        return status == PROJECT_STATUS.NONE || status == PROJECT_STATUS.ERROR
    }

    isAllDone() {
        let isDone = true
        for (let projName in this.projStatusAll) {
            let cfg = this.projStatusAll[projName]
            if (cfg.status != PROJECT_STATUS.NONE && cfg.status != PROJECT_STATUS.ERROR) {
                isDone = false
                break
            }
        }
        return isDone
    }

    _init() {
        this.updateProjStatusFromFile()
    }

    startReadConfig() {
        this.mgr.timer.loop(5000, this, this.readConfig)
    }

    stopReadConfig() {
        this.mgr.timer.clear(this, this.readConfig)
        this.readConfig()
    }

    updateProjStatusFromFile() {
        this.readConfig()
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
        console.log("==read update_dynamic_status.json")
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
        this.projStatusAll = data
        return data
    }

    writeConfig(data) {
        let plugin = this.mgr.plugin.getPlugin(PLUGIN_TYPE.FILE)
        let path = "./../config/update_dynamic_status.json"
        plugin.writeFileSync(path, data)
    }
}


module["exports"] = ProjectStatusVo

