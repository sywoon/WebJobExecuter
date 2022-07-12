const process = require ("process")
const Utils = require ("./framework/utils")
const NodeServer = require ("./framework/node_server")
const ToolsConfig = require ("./framework/tools_config")
const ResponseOperator = require ("./framework/response_operator")
const PM = require("./framework/plugin_mgr")
const Logic = require("./logic/logic")



function main(toolPath, rootPath) {
    toolPath = Utils.fixPath(toolPath, true)
    rootPath = Utils.fixPath(rootPath, true)

    let toolsConfig = new ToolsConfig(rootPath)
    let cfgServer = toolsConfig.getConfig("node_server")

    let pluginMgr = new PM.PluginMgr()
    pluginMgr.registerPlugins()

    let nodeSvr = new NodeServer()
    let resOperator = new ResponseOperator(nodeSvr, pluginMgr)
    nodeSvr.setDealDataCall(resOperator.onReceiveClientData.bind(resOperator))
    nodeSvr.startServer(cfgServer.ip, cfgServer.port)

    let logic = new Logic(pluginMgr)
    logic.registerAll()
}

const args = process.argv.slice(2)
let toolPath = args[0]
let rootPath = args[1]
main(toolPath, rootPath)


