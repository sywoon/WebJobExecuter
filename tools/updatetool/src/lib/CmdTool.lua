local M = {}
local DEBUG = false
local MODE = 1   -- 1:os.execute 2:io.popen


function M:setEnvPath(path)
	self.envPath = path
end

function M:executeCmd(cmd)
	local envPath = self.envPath or 
					'bin;bin/etcpack;C:\\Program Files (x86)\\CodeAndWeb\\TexturePacker\\bin\\;'
					.. 'D:\\Program Files (x86)\\CodeAndWeb\\TexturePacker\\bin\\;'
					.. 'D:\\Program Files (x86)\\TexturePacker\\bin;'
					.. 'C:\\Program Files\\ARM\\Mali Developer Tools\\Mali Texture Compression Tool v4.3.0\\bin;'

	local path = '"set path=' .. envPath .. ';%path%" & '
	cmd = path .. cmd
	if DEBUG then
		myLog("---executeCmd---")
		myLog(cmd)
	else
		cmd = cmd .. " 1>nul"  --保留错误信息
		-- cmd = cmd .. " 1>nul 2>&1"
	end

	--lua5.1和5.3返回值不同
	if MODE == 1 then
		local status, msg, code = os.execute(cmd)
		if not status then
			myLoge(msg .. " cmd execute failed:" .. cmd)  --控制台上看不到 但log文件里能看到
		end
	
	elseif MODE == 2 then
		local handle = io.popen(cmd)
		local result = handle:read("*a")
		myLog(result)

		-- for msg in handle:lines() do   //针对 dir之类的命令
		-- 	myLog(msg)
		-- end
		handle:close()
	end
end


rawset(_G, "CmdTool", M)



return M