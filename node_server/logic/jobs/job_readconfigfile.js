const JobBase = require("../../framework/jobs/job_base");
const logger = require ("../../framework/libs/logger")
const Define = require("./../../define")

class JobReadConfigFile extends JobBase {
    // {plugin_type:number, cmd:string|number, data:{...}}
    // data.data: {filename:""}
    // result: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    dealData(data, result) {
        let filename = data.data.filename
        if (!filename) {
            result.code = Define.CMD_ERROR.COMMON
            result.msg = "param error:lost filename. data:" + JSON.stringify(data)
            return
        }

        let plugin = this.getPlugin()
        let path = `./../config/${filename}`
        let content = plugin.readFileSync(path)
        result.data = {filename:filename, content:content}
    }
}


module["exports"] = JobReadConfigFile