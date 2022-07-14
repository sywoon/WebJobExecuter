const JobBase = require("../../framework/jobs/job_base");
const logger = require ("../../framework/libs/logger")
const Define = require("./../../define")

class JobReadConfigFile extends JobBase {
    // data: {filename:""}
    // result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    dealData(data, result) {
        if (!data.filename) {
            result.code = Define.CMD_ERROR.COMMON
            result.msg = "param error:lost filename. data:" + JSON.stringify(data)
            return
        }

        let plugin = this.getPlugin()
        let path = `./../config/${data.filename}`
        let content = plugin.readFileSync(path)
        result.data = {filename:data.filename, content:content}
    }
}


module["exports"] = JobReadConfigFile