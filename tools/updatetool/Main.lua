--===================================
-- env
--
local extpath = ""
for _, path in ipairs({
            "src",
            "src/lib",
            "src/UI",
            "src/Module",
            }) do
    local str = string.gsub(";#\\?;#\\?.lua;#\\?\\init.lua;#\\?.luac", "#", path)
    extpath = extpath .. str
end
package.path = package.path .. extpath

local extcpath = ""
for _, path in ipairs({
            "src/lib",
            }) do
    local str = string.gsub(";#\\?.dll", "#", path)
    extcpath = extcpath .. str
end
package.cpath = package.cpath .. extcpath
--
--===================================

require "sllib_base"
require "CmdTool"
require "Global"
local App = require "App"


if #arg ~= 6 then
    myLoge("参数数量错误")
    return
end

local packToolPath = arg[1]
local mode = tonumber(arg[2])   --1:update_all 2:sync_res
local projName = arg[3]
local projPath = arg[4]
local gitBranch = arg[5]
local outConfigFile = arg[6]  --update_dynamic_status.txt 和更新服务器同步用

SetConsoleMode(1)  --1:CMD(ansi) 2:node(utf8)

do
    local d = os.date("*t")
    local logpath = _F("%s/../log/lua_log_%d_%d_%d.txt", packToolPath, d.year, d.month, d.day)
    logs.setLogPath(logpath)
    clearLog()
end

function runByMode()
    local startT = os.time()
    if mode == 1 then
        local suc, chged = app:startUpdate()
        if suc then
            myLog(_F("\n更新结束 用时：%d秒", os.time() - startT))
            if not chged then
                myLog("\n==[App]没有新内容!")
            end
        else
            myLoge("\n更新失败，请检查前面的报错log！")
        end
    elseif mode == 2 then
        local suc = app:startSyncRes()
        if suc then
            myLog(_F("\n同步结束 用时：%d秒", os.time() - startT))
        else
            myLoge("\n同步失败，请检查前面的报错log！")
        end
    end
end


function Main()
    local app = App.new()
    rawset(_G, "app", app)

    app:init(packToolPath, projName, projPath, gitBranch, outConfigFile)
    runByMode()
    
end


local function _Traceback(err)
    myLog("LUA ERROR:" .. tostring(err))
    myLog(debug.traceback())
end

xpcall(Main, _Traceback)

