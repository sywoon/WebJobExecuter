const process = require ("process")
const Utils = require ("./utils")
const NodeServer = require ("./node_server")
const ToolsConfig = require ("./tools_config")
const ResponseOperator = require ("./response_operator")
const PluginMgr = require("./plugin_mgr")



function main(toolPath, rootPath) {
    toolPath = Utils.fixPath(toolPath, true)
    rootPath = Utils.fixPath(rootPath, true)

    let toolsConfig = new ToolsConfig(rootPath);
    let cfgServer = toolsConfig.getConfig("node_server")

    let pluginMgr = new PluginMgr()
    pluginMgr.registerPlugins()

    let nodeSvr = new NodeServer()
    let resOperator = new ResponseOperator(nodeSvr, pluginMgr)
    nodeSvr.setDealDataCall(resOperator.onReceiveClientData.bind(resOperator))
    nodeSvr.startServer(cfgServer.ip, cfgServer.port)
}

const args = process.argv.slice(2);
let toolPath = args[0];
let rootPath = args[1];
main(toolPath, rootPath);

