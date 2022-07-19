local Png8Cache = require "Png8Cache"
local M = class("ProjectModel")

local CONVERT_TO_PNG8 = false


function M:ctor()
end

-- packToolPath: updatetool目录路径
-- projName: master
-- projPath: shj_master路径
-- outConfigFile: xxx/config/update_dynamic_status.json
function M:initConfig(packToolPath, projName, projPath, gitBranch, outConfigFile)
    self.packToolPath = packToolPath
    self.projName = projName
    self.projPath = projPath
    self.gitBranch = gitBranch
    self.outConfigFile = outConfigFile

    local cfgPath = _F("%s/../../config/project_config.json", packToolPath)
    local data = io.readJsonFile(cfgPath, _U2A)
    self.projConfig = data

    -- 如果自己分析 可以这样获取路径  同projPath
    -- local projRootPath = self.projConfig["projRootPath"]
    -- if not projRootPath.match("^%w:") then  --相对路径  d:/ e:/
    --     projRootPath = packToolPath .. "/../config/" .. projRootPath
    -- end
    -- self.projRootPath = projRootPath

    local cfgDynamicPath = _F("%s/../../config/project_config_dynamic.lua", packToolPath)
    if os.exist(cfgDynamicPath) then
        local dataDynamic = io.readLuaFile(cfgDynamicPath, _U2A)
        if not dataDynamic then
            self.projConfigDyn = {}
            self:_saveProjConfigDynamic()
        else
            self.projConfigDyn = dataDynamic
        end
    else
        self.projConfigDyn = {}
    end
end

function M:_saveProjConfigDynamic()
    local filter = function (text)
        text = _A2U(text)
        return "return " .. text
    end
    local cfgDynamicPath = _F("%s/../../config/project_config_dynamic.lua", self.packToolPath)
    io.writeLuaFile(cfgDynamicPath, self.projConfigDyn, filter)
end

function M:getGitBranch()
    return self.gitBranch
    -- return self.projConfig[self.projName].gitBranch
end

function M:getProjectRootPath()
    return self.projPath
end

function M:getClientProjPath()
    if self.projConfig[self.projName].clientProjName then
        return self.projPath .. self.projConfig[self.projName].clientProjName
    end

    return self.projPath .. self.projConfig["commonCfg"].clientProjName
end

function M:getUIProjPath()
    if self.projConfig[self.projName].uiProjName then
        return self.projPath .. self.projConfig[self.projName].uiProjName
    end
    return self.projPath .. self.projConfig["commonCfg"].uiProjName
end

--动态记录的版本
function M:getDynamicVersion(subName)
    if not self.projConfigDyn[self.projName] then
        return 0
    end

    if not self.projConfigDyn[self.projName][subName] then
        return 0;
    end
    return self.projConfigDyn[self.projName][subName]
end

function M:setDynamicVersion(subName, version)
    if not self.projConfigDyn[self.projName] then
        self.projConfigDyn[self.projName] = {}
    end

    self.projConfigDyn[self.projName][subName] = version
    self:_saveProjConfigDynamic()
end

function M:getGitProjVersion(projPath)
    if not os.exist(projPath) then
        myLoge("path not exist:" .. projPath)
        return 0
    end

    local cmd = _F([[echo off & pushd "%s" & git log -1 & popd]], projPath)
    local handle = io.popen(cmd)
    local result = handle:read("*a")
    handle:close()

    local versionLong = string.match(result, "commit (%w*)")
    local version = string.sub(versionLong, 1, 8)

    if string.len(version) ~= 8 then
        myLoge("git version get failed:" .. projPath, versionLong)
        return 0
    end
    return version
end

function M:getSvnProjVersion(projPath)
    local cmd = _F([[echo off & pushd "%s" & svn info & popd]], projPath)
    local handle = io.popen(cmd)
    local result = handle:read("*a")
    handle:close()

    local versionLong = string.match(result, "\nRevision: (%d*)")
    -- local versionLong = string.match(result, "\nLast Changed Rev: (%d*)")
    local version = tonumber(versionLong)
    if not version or version < 1 then
        myLoge("git version get failed:" .. projPath, versionLong)
        return 0
    end

    return version
end

function M:runBatCmd(cmd)
    local handle = io.popen(cmd)
    local result = handle:read("*a")
    handle:close()
    return result
end


function M:updateExcel()
    myLog("\n==[Project]update excel")

    local cmd = self.packToolPath .. "\\bin\\excel_update.bat " .. self.projPath
    local result = self:runBatCmd(cmd)

    local excelPath = _F("%s/excel", self.projPath)
    local versionNew = self:getSvnProjVersion(excelPath)
    local cfgVersion = self:getDynamicVersion("excel")
    local chged = versionNew ~= cfgVersion

    myLog("==[Project]update excel End\n", versionNew, cfgVersion)
    return chged, versionNew
end

-- return: suc, chged, errMsg
function M:exportExcel()
    local chged, versionNew = self:updateExcel()
    if not chged then
        myLog("==[Project]excel already lastest! version:" .. versionNew)
        return true, false
    end
    
    myLog("\n==[Project]export excel")
    local cmd = self.packToolPath .. "\\bin\\excel_export.bat " .. self.projPath
    -- local rst, msg, code = os.execute(cmd)
    -- myLog("exportExcel", rst, msg, code)  --true    exit    0

    local result = self:runBatCmd(cmd)
    if string.match(result, "Traceback") then
        myLoge("export excel failed", result)
        return false, false, "export excel failed:" .. _A2U(result)
    end

    -- 其他情况导表报错  导致版本升了  数据不是最新的？
    -- 有这种可能  还没发现！
    self:setDynamicVersion("excel", versionNew)
    
    myLog("==[Project]export excel End\n")
    return true, true
end

function M:updateProtol()
    myLog("\n==[Project]update proto")
    local branch = self:getGitBranch()
    
    -- 更新一次后 才会有分支文件夹
    local cmd = _F("%s\\bin\\protol_update.bat %s %s", self.packToolPath,
                        self.projPath, branch)
    local result = self:runBatCmd(cmd)

    if string.match(result, "error") then
        myLoge("update proto failed", result)
        return false, 0
    end

    local protolPath = _F("%s/tools/protocol/%s", self.projPath, branch)
    local versionNew = self:getGitProjVersion(protolPath)
    local cfgVersion = self:getDynamicVersion("protol")
    
    local chged = cfgVersion ~= versionNew
    myLog("==[Project]update proto End\n", versionNew, cfgVersion)
    return chged, versionNew
end

-- return: suc, chged, errMsg
-- 协议没遇到报错情况 忽略检查
function M:exportProtol()
    local chged, versionNew = self:updateProtol()
    if not chged then
        if versionNew == 0 then
            return false, false, "update proto failed"
        end

        myLog("==[Project]proto already lastest! version:" .. versionNew)
        return true, false
    end

    myLog("\n==[Project]export Protol")
    local branch = self:getGitBranch()
    local cmd = _F("%s\\bin\\protol_export.bat %s %s", self.packToolPath,
                        self.projPath, branch)
    local result = self:runBatCmd(cmd)
    if string.match(result, "error") then
        myLoge("export proto falied", result)
        return false, 0, "export proto failed:" .. _A2U(result)
    end

    -- 没找到协议导出出错的情况 

    self:setDynamicVersion("protol", versionNew)
    myLog("==[Project]export Protol End\n", versionNew)
    return true, true
end


function M:updateUI()
    myLog("\n==[Project]update UI")
    local branch = self:getGitBranch()
    local cmd = _F("%s\\bin\\ui_update.bat %s %s", self.packToolPath,
                        self.projPath, branch)

    local result = self:runBatCmd(cmd)

    local uiPath = self.projPath .. "/shj_uiedit_git"
    local versionNew = self:getGitProjVersion(uiPath)
    local cfgVersion = self:getDynamicVersion("uiproj")
    
    local chged = cfgVersion ~= versionNew

    myLog("==[Project]update UI End\n", versionNew, cfgVersion)
    return chged, versionNew
end

-- return: suc, chged, errMsg
function M:compileUI()
    local chged, versionNew = self:updateUI()
    if not chged then
        myLog("==[Project]UI already lastest! version:" .. versionNew)
        return true
    end
    
    myLog("\n==[Project]compile UI(long time)")
    local cmd = self.packToolPath .. "\\bin\\ui_compile.bat " .. self.projPath
    local result = self:runBatCmd(cmd)

    if string.match(result, "Error:") then
        myLog(result)
        myLoge("compile ui failed")
        return false, false, "compile ui failed:" .. _A2U(result)
    end

    if CONVERT_TO_PNG8 then
        self:convertUIPng8()
    end

    self:setDynamicVersion("uiproj", versionNew)
    myLog("==[Project]compile UI End\n")
    return true
end

function M:convertUIPng8()
    local uiPath = self.projPath .. "/shj_client_git/bin/res/atlas"
    myLog("==[Project]compress image：" .. uiPath)
    Png8Cache:convertPngPath(uiPath)
end


--有些文件导出后并没传git
--比如：excel proto uiproj
--由于client更新时会先把修改的还原了 所以需要先保存
function M:_backupClientOthers()
    myLog("backup temp res")
    local clientBackup = self.projConfig["commonCfg"].clientBackup
    local tempPath = self.projPath .. "__temp__" .. os.time() .. "/"
    os.rmdir(tempPath)
    os.mkdir(tempPath)

    local clientPath = self.projPath .. "/shj_client_git/"
    for _, file in ipairs(clientBackup) do
        os.copyfile(clientPath .. file, tempPath .. file)
    end
    return tempPath
end

function M:_restoreClientOthers(backupPath)
    myLog("restore temp res")
    local clientBackup = self.projConfig["commonCfg"].clientBackup
    local clientPath = self.projPath .. "/shj_client_git/"
    for _, file in ipairs(clientBackup) do
        local dir = os.dirname(file)
        os.movefile(backupPath .. file, clientPath .. dir)
    end

    os.rmdir(backupPath)
end


function M:updateCient()
    myLog("\n==[Project]update client")

    local backupPath = self:_backupClientOthers()
    local branch = self:getGitBranch()

    local cmd = _F("%s\\bin\\client_update.bat %s %s", self.packToolPath,
                        self.projPath, branch)
    local result = self:runBatCmd(cmd)

    self:_restoreClientOthers(backupPath)

    local projpath = self.projPath .. "/shj_client_git"
    local versionNew = self:getGitProjVersion(projpath)
    local cfgVersion = self:getDynamicVersion("client")
    
    local chged = cfgVersion ~= versionNew

    myLog("==[Project]update client End\n", versionNew, cfgVersion)
    return chged, versionNew
end

-- return: suc, chged, errMsg
function M:compileClient()
    local chged, versionNew = self:updateCient()
    if not chged then
        myLog("==[Project]client already lastest! version:" .. versionNew)
        return true
    end
    
    myLog("\n==[Project]compile client(long time)")
    local cmd = _F("%s\\bin\\client_compile.bat %s", self.packToolPath,
                        self.projPath)

    --比较久 用execute可以显示子步骤   但是无法通过返回值判断是否失败
    -- local rst, msg, code = os.execute(cmd)
    -- if not rst then
    --     myLog(("compile client failed:" .. msg))
    --     return false
    -- end

    local result = self:runBatCmd(cmd)
    if string.match(result, "error") then
    	myLog(result)
        myLoge("compile client failed")
        return false, false, "compile client failed:" .. _A2U(result)
    end

    self:setDynamicVersion("client", versionNew)
    myLog("==[Project]compile client End\n")
    return true
end

function M:syncResFromEdit()
    myLog("\n==[Project]sync resource(long time)")
    local backupPath = self:_backupClientOthers()
    local cmd = _F("%s\\bin\\sync_res_from_uiedit.bat %s", self.packToolPath,
                        self.projPath)

    print(cmd)
    local result = self:runBatCmd(cmd)
    self:_restoreClientOthers(backupPath)

    if string.match(result, "error") then
        myLog(result)
        myLoge("sync resource failed")
        return false, false, "sync resource failed:" .. _A2U(result)
    else
        print(result)
    end

    
    myLog("==[Project]sync resource End\n")
    return true
end

return M