
class JobGroup {
    constructor() {
        this.jobs = []
        this.jobIdx = 0
        this.endCbk = null
    }

    addJob(job) {
        this.jobs.push(job)
    }

    dealData(data, result, endCbk) {
        this.jobIdx = 0
        this.endCbk = endCbk
        this.nextJob(data, result)
    }

    nextJob(data, result) {
        if (this.jobIdx >= this.jobs.length) {
            this.endCbk && this.endCbk(result)
            return
        }

        let job = this.jobs[this.jobIdx]
        job.dealData(data, result, this.nextJob.bind(this, data, result))
    }
}




module['exports'] = JobGroup
