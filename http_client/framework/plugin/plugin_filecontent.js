(function(exports) {

    // 文件内容查看器：客户端可读取服务器的文件内容
    class PluginFileContent extends PluginBase {
        dealData(data) {
            responseBack("PluginFileContent", data)
        }
    }


exports.PluginFileContent = PluginFileContent
})(window)