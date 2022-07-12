(function(exports) {

    // 文件内容查看器：客户端可读取服务器的文件内容
    class PluginFileContent extends PluginBase {
        dealData(data, responseBack) {
            responseBack("PluginFileContent", {bb:22}, "22")
        }
    }


exports.PluginFileContent = PluginFileContent
})(window)