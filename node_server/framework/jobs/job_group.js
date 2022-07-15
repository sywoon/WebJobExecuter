
class JobGroup {
    constructor(logic, cmd, pluginType, isAync) {
        this.mgr = logic.mgr
        this.logic = logic
        this.cmd = cmd
        this.pluginType = pluginType
        this.jobs = []
        this.jobIdx = 0
        this.endCbk = null
        this.isAync = isAync
    }

    getPlugin() {
        return this.mgr.plugin.getPlugin(this.pluginType)
    }

    addJob(job) {
        this.jobs.push(job)
    }

    dealData(data, result, endCbk) {
        if (this.isAync) {
            this.jobIdx = 0
            this.endCbk = endCbk
            this.nextJob(data, result) 
        } else {
            for (let job of this.jobs) {
                job.dealData(data, result)
            }
            endCbk && endCbk()
        }
    }

    nextJob(data, result) {
        if (this.jobIdx >= this.jobs.length) {
            this.endCbk && this.endCbk(result)
            return
        }

        let job = this.jobs[this.jobIdx]
        this.jobIdx++;
        //异步任务 result将由第一个job决定
        job.dealDataAsync(data, this.jobIdx==1?result:null, this.nextJob.bind(this, data, result))
    }
}




module['exports'] = JobGroup
