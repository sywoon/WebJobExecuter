let process = require ("process")
let NodeServer = require ("./node_server")
let ProjConfig = require ("./proj_config")



function main(toolPath) {
    let projConfig = new ProjConfig(toolPath);
    let nodeSvr = new NodeServer(projConfig);
    nodeSvr.startServer();
}

const args = process.argv.slice(2);
let toolPath = args[0];
main(toolPath);

