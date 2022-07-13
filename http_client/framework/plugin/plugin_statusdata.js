(function(exports) {

// 数据来源任意：可文件 可内存
    class PluginStatusData extends PluginBase {
        dealData(data) {
            responseBack("PluginStatusData", data)
        }
    }

    exports.PluginStatusData = PluginStatusData
})(window)