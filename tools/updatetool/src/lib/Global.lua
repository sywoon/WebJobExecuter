local CONSOLE_MODE = 1  --1:CMD(ansi) 2:node(utf8)

function SetConsoleMode(mode)
    CONSOLE_MODE = mode
end


local function moreU2A(...)
    local args = {...}
    local temp = {}
    for _, str in ipairs(args) do
        table.insert(temp, _U2A(str))
    end

    local msg = table.concat(temp, '\t')
    return msg
end

-- 输入的字符串都是utf8
-- mode: i w e
local function _myLog(mode, ...)
    local _ = log
    if mode == "w" then
        _ = logw
    elseif mode == "e" then
        _ = loge
    end

    if CONSOLE_MODE == 1 then  --将utf8转ansi
        local msg = moreU2A(...)
        _(msg)
    elseif CONSOLE_MODE == 2 then
        _(...)
    end
end

function myLog(...)
    _myLog("i", ...)
end

function myLogw(...)
    _myLog("w", ...)
end

function myLoge(...)
    _myLog("e", ...)
end

