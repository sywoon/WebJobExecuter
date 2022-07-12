
class PluginBase {
    constructor(mgr) {
        this.mgr = mgr
        this.jobGroup = {}
    }

    registerJobGroup(key, group) {
        this.jobGroup[key] = group
    }

    dealData(data, result) {}
}




module['exports'] = PluginBase
