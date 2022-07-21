import {PluginBase} from "./plugin_base.js"

// 命名执行器：和客户端交互具体的业务逻辑
export class PluginCmdExecuter extends PluginBase {
    //data: {plugin_type:number, cmd:string|number, code:0, data:{...}, msg:""}
    dealData(data) {

        super.dealData(data)
    }
}

