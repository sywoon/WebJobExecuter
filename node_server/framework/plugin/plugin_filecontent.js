const PluginBase = require("./plugin_base");
const fs = require("fs")
const logger = require ("../libs/logger")


// 文件内容查看器：客户端可读取服务器的文件内容
class PluginFileContent extends PluginBase {

    dealData(data, result) {
        super.dealData(data, result)
    }

    readFileAsync(file, cbk) {
        fs.readFile(file, "utf8", (err, data) => {
            if (err) {
                logger.error("read file async failed:" + file)
            }
            cbk && cbk(data)
        })
    }

    readFileSync(file) {
        let data = fs.readFileSync(file, "utf8")
        if (!data) {
            logger.error("read file sync failed:" + file)
        }
        return data
    }

    writeFileSync(file, data) {
        let type = typeof(data)
        if (type == "object") {
            data = JSON.stringify(data)
        } else if (type == "string") {
        } else {
            data = String(data)
        }
        fs.writeFileSync(file, data)
    }
}




module['exports'] = PluginFileContent