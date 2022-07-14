
class JobGroup {
    constructor(cmd, pluginType, isAync) {
        this.jobs = []
        this.jobIdx = 0
        this.endCbk = null
        this.isAync = isAync
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
        //异步任务 result将由第一个job决定
        job.dealDataAsync(data, this.jobIdx== 0?result:null, this.nextJob.bind(this, data, result))
        this.jobIdx++;
    }
}




module['exports'] = JobGroup
