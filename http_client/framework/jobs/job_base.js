export class JobBase {
    constructor(cmd, pluginType, logic) {
        this.cmd = cmd
        this.pluginType = pluginType
        this.logic = logic
        this.mgr = logic.mgr
    }

    setMonitor(obj) {
        this.monitor = obj
    }

    getMonitor() {
        return this.monitor
    }

    getPlugin() {
        return this.mgr.plugin.getPlugin(this.pluginType)
    }

    sendServerCmd(data) {
        let plugin = this.getPlugin()
        plugin.sendServerCmd(this.cmd, data)
        this.monitor && this.monitor.onSendServerCmd(this.cmd, data)
    }

    dealData(data) {
        this.monitor && this.monitor.onDealResponseData(data)
    }
}



