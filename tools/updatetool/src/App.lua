local SyncTool = require "SyncTool"
local Png8Cache = require "Png8Cache"
local Models = require "Models"
local Define = require "Define"

local CMD_TYPE = Define.CMD_TYPE
local UPDATE_STATUS = {
    NONE = 0,
    PREPARE = 1,
    EXPORT_EXCEL = 2,
    EXPORT_PROTOL = 3,
    EXPORT_UI = 4,
    COMPILE_CLIENT = 5,
    SYNC_ART_RES = 6,
    ERROR = 100,
}

local App = class("App")

function App:init(packToolPath, projName, projPath, gitBranch, outConfigFile)
    self.projName = projName
    self.projPath = projPath
    self.gitBranch = gitBranch
    self.outConfigFile = outConfigFile
    SyncTool:setToolPath(packToolPath)
    Png8Cache:init(packToolPath)

    Models:registerAll()
    models.project:initConfig(packToolPath, projName, projPath, gitBranch, outConfigFile)
end

-- 更新状态 入update_dynamic_status.txt
-- master = {
--     lastUpdateTime: new Date().getTime() - 60 * 1000,  //算1h前更新过
--     startTime: new Date().getTime(),  //更新开始时间  可以方便判断是否卡很久了
--     status: UPDATE_STATUS.NONE,
--     errMsg: "导出excel失败",
-- }
function App:changeUpdateStatus(status, others)
    local dataAll = io.readJsonFile(self.outConfigFile)
    local data = dataAll[self.projName] or {}
    dataAll[self.projName] = data
    data.status = status

    if others then
        for k, v in pairs(others) do
            data[k] = v
        end
    end

    io.writeJsonFile(self.outConfigFile, dataAll)
end


function App:startSyncRes()
    --update uiedit and client
    --无论版本是否最新 都要同步一次资源  因为不能确定是否同步过
    self:changeUpdateStatus(UPDATE_STATUS.EXPORT_UI, {cmd=CMD_TYPE.SYNC_ART_RES})
    models.project:updateUI()
    models.project:updateCient()

    self:changeUpdateStatus(UPDATE_STATUS.SYNC_ART_RES)
    local suc, errMsg = models.project:syncResFromEdit()
    if not suc then 
        --json格式 除了固定的\t \b \v等 其他都会解析失败
        --比如 路径 xx\sxxx  就会导致解析出错
        errMsg = errMsg or ""
        errMsg = self.projName .. ":" .. errMsg
        errMsg = string.gsub(errMsg, "\\", "/")
        self:changeUpdateStatus(UPDATE_STATUS.ERROR, {errMsg=errMsg})
        return false
    end

    self:changeUpdateStatus(UPDATE_STATUS.NONE, {lastUpdateTime=os.time()*1000})
    return true
end

function App:startUpdate()
    local suc, chged, errMsg = self:updateAll()
    if not suc then 
        --json格式 除了固定的\t \b \v等 其他都会解析失败
        --比如 路径 xx\sxxx  就会导致解析出错
        errMsg = errMsg or ""
        errMsg = self.projName .. ":" .. errMsg
        errMsg = string.gsub(errMsg, "\\", "/")
        self:changeUpdateStatus(UPDATE_STATUS.ERROR, {errMsg=errMsg})
        return false, chged
    end
    return true, chged
end


function App:updateAll()
    local hasChged = false

    self:changeUpdateStatus(UPDATE_STATUS.EXPORT_EXCEL, {cmd=CMD_TYPE.UPDATE_CLIENT, startTime=os.time()*1000, errMsg=""})
    local suc, chged, errMsg = models.project:exportExcel()
    if not suc then return false, chged, errMsg end
    hasChged = hasChged or chged

    self:changeUpdateStatus(UPDATE_STATUS.EXPORT_PROTOL)
    local suc, chged, errMsg = models.project:exportProtol()
    if not suc then return false, chged, errMsg end
    hasChged = hasChged or chged

    self:changeUpdateStatus(UPDATE_STATUS.EXPORT_UI)
    local suc, chged, errMsg = models.project:compileUI()
    if not suc then return false, chged, errMsg end
    hasChged = hasChged or chged

    self:changeUpdateStatus(UPDATE_STATUS.COMPILE_CLIENT)
    local suc, chged, errMsg = models.project:compileClient()
    if not suc then return false, chged, errMsg end
    hasChged = hasChged or chged

    self:changeUpdateStatus(UPDATE_STATUS.NONE, {lastUpdateTime=os.time()*1000})
    return true, hasChged
end




return App