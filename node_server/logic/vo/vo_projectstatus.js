const Define = require ("../../define")

const PROJECT_STATUS = Define.PROJECT_STATUS
const PLUGIN_TYPE = Define.PLUGIN_TYPE



class ProjectStatusVo {
    constructor(logic) {
        this.logic = logic
        this.mgr = logic.mgr
        this.projStatus = {}

        this._init()
    }

    _init() {
        this.updateProjStatusFromFile()
    }

    updateProjStatusFromFile() {
        let data = this.readConfig()
        this.projStatus = data
    }

    getProjStatus(projName) {
        return this.projStatus[projName] || {}
    }

    getProjStatusAll() {
        return this.projStatus
    }

    setProjStatus(projName, data) {
        this.projStatus[projName] = data
        this.writeConfig(this.projStatus)
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

