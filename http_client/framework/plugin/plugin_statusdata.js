(function(exports) {

// 数据来源任意：可文件 可内存
    class PluginStatusData extends PluginBase {
        dealData(data, responseBack) {
            responseBack("PluginStatusData", {cc:33}, "33")
        }
    }

    exports.PluginStatusData = PluginStatusData
})(window)