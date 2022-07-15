
class JobBase {
    constructor(group) {
        this.owner = group
        this.mgr = group.mgr
        this.logic = group.logic
    }

    getPlugin() {
        return this.owner.getPlugin()
    }

    dealData(data, result) {}
    dealDataAsync(data, result, cbk) {}
}



module['exports'] = JobBase
