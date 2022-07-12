let fs = require("fs")
// let Utils = require("./utils")

let date = new Date()
let logFile = `../log/node_log_${date.getFullYear()}_${date.getMonth()+1}_${date.getDate()}.txt`
fs.mkdir("../log/", 0777, function (err) {
    if (err && err.code == "EEXIST")
        return
    err && console.log(err)
})

function setLogPath(path) {
    logFile = path
}

function log(...msgs) {
    let msg = msgs.join("")
    console.log(msg)
    fs.appendFileSync(logFile, msg, {encodeing:"binary"})
    //fs.writeFileSync("../node_log.txt", msg)
}

function logcmd(msgs) {
    let msg = msgs.join("")
    // msg = Utils.cmd2u(msg)
    log(msg)
}


module['exports'] = {log, logcmd, setLogPath}
