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

function any2str(msg) {
    if (typeof msg === "string") {
        return msg
    }
    else if (typeof msg === "object") {
        try {
            msg = JSON.stringify(msg)
        } catch (error) {
            msg = String(msg)
        }
        return msg
    } else {
        return String(msg)
    }
}

function args2str(...args) {
    let arr = [];
    for (var i = 0; i < args.length; i++) {
        let msg = args[i]
        msg = any2str(msg)
        arr.push(msg)
    }

    let text = arr.join("\t")
    return text
}

function log(...msgs) {
    let msg = args2str(...msgs)
    console.log(msg)
    fs.appendFileSync(logFile, msg, {encodeing:"binary"})
    //fs.writeFileSync("../node_log.txt", msg)
}

function warn(...msgs) {
    let msg = args2str(...msgs)
    console.warn(msg)
    fs.appendFileSync(logFile, msg, {encodeing:"binary"})
}

function error(...msgs) {
    let msg = args2str(...msgs)
    console.error(msg)
    fs.appendFileSync(logFile, msg, {encodeing:"binary"})
}

function logcmd(...msgs) {
    let msg = args2str(...msgs)
    // msg = Utils.cmd2u(msg)
    log(msg)
}


module['exports'] = {log, warn, error, logcmd, setLogPath}
