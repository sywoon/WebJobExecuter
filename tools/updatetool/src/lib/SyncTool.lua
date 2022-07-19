---------------------------
-- 已废弃 留作思路参考 使用FileSync.lua代替


local M = {}
local Debug = true

function M:setToolPath(path)
	self._toolPath = path
end

function M:syncDiff(pathFrom, pathTo)
	local cmd = _F("%s/bin/bc_sync/sync.bat %s %s 1",
					self._toolPath, pathFrom, pathTo)

	local rst, msg, code = os.execute(cmd)
	print("syncDiff", rst, msg, code)  --true    exit    0
end

function M:syncDiffAndNew(pathFrom, pathTo)
	local cmd = _F("%s/bin/bc_sync/sync.bat %s %s 2",
					self._toolPath, pathFrom, pathTo)

	local rst, msg, code = os.execute(cmd)
	print("syncDiffAndNew", rst, msg, code)  --true    exit    0
end

function M:syncMirror(pathFrom, pathTo)
	local cmd = _F("%s/bin/bc_sync/sync.bat %s %s 3",
					self._toolPath, pathFrom, pathTo)

	local rst, msg, code = os.execute(cmd)
	print("syncMirror", rst, msg, code)  --true    exit    0
end

function M:copyTwoFolder(from, to, needClear)
	if needClear then
		os.rmdir(to)
		os.mkdir(to)
	end
	return os.copydir(from, to)
end

function M:syncTwoFolder(from, to)
	local firstTime = not os.exist(to)
    if firstTime then
        return os.copydir(from, to)
    end

	SyncTool:syncDiffAndNew(from, to)
	return true
end


rawset(_G, "SyncTool", M)


return M