// const iconvl = require('iconv-lite')
const child_process = require('child_process')
const logger = require ('./libs/logger')

class Utils {

    static __init__() {
    }

    static fixPath(path, keepLast) {
        path = path.replace(/\\/g, "/")
        path = path.replace(/\/\//g, "/")
        if (keepLast && path.charAt(path.length-1) != "/") {
            path = path + "/"
        }
        return path
    }

    //简体中文windows命令行，都使用的是CP936(近似于gb2312)编码
    // static cmd2u(txtAnsi) {
    //     let byte = iconvl.decode(Buffer.from(txtAnsi, "binary"), "cp936")
    //     return byte
    // }

    static runCmd(cmd) {
        child_process.exec(cmd, {maxBuffer: 1024 * 1024 * 10, encoding:"binary"}, (error, stdout, stderr) => {
            console.log("runCmd cbk")
            if (error) {
                let str = `批处理运行失败:${error}`
                logger.log(str)
            } else {
                logger.log("\n---cmd start")
                logger.logcmd(`stdout ${stdout}`)
                logger.logcmd(`stderr ${stderr}`)
                logger.log("---cmd end")
            }
        })
    }
}



module['exports'] = Utils