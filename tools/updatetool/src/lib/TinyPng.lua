
local M = {}

function M:setToolPath(path)
	self._toolPath = path
end

--filelist 一个txt 记录了所有图片的完整路径
function M:convertPngByFilelist(filelist)
	local cmd = _F("%s/bin/tinyPng/tinyPng.bat 3 %s",
					self._toolPath, filelist)

	local rst, msg, code = os.execute(cmd)
	print("convertPng", rst, msg, code)  --true    exit    0
end

function M:convertPngByPath(pathFrom, pathTo)
	local cmd = _F("%s/bin/tinyPng/tinyPng.bat 1 %s %s",
					self._toolPath, pathFrom, pathTo)
 
	local rst, msg, code = os.execute(cmd)  --true    exit    0
	if not rst then
        printe("convertPngByPath failed", rst, msg, code)
	end
end

function M:convertPng(imgPath)
	local cmd = _F("%s/bin/tinyPng/tinyPng.bat 2 %s",
					self._toolPath, imgPath)

	local rst, msg, code = os.execute(cmd)
	if not rst then
        printe("convertPng failed", rst, msg, code)
	end
end

return M