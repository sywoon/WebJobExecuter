local md5 = require "md5"
local TinyPng = require "TinyPng"

local Png8Cache = {}

local CACHE_TEMP_PATH = "__png8__cache__"
local MANIFEST_FILE = "files_manifest.lua"


function Png8Cache:init(toolPath)
    self._toolPath = toolPath
    TinyPng:setToolPath(toolPath)
    self:_readManifest()
end


function Png8Cache:convertPngPath(folderPath)
    folderPath = os.fixPath(folderPath, true)
    local frontPath = folderPath
    --print("convertPngPath", folderPath)

    local files = os.dirext(folderPath, true, {".png"})
    local fileList = {}
    local md5List = {}
    for _, imgPath in ipairs(files) do
        imgPath = os.fixPath(imgPath, false)
        frontPath = os.fixPath(frontPath, true)
        local relativePath = string.cutsub(imgPath, frontPath)
        local uniqueFolder = self:_frontPathToFolderName(frontPath)
        local imgmd5 = md5.sumFile(imgPath)
        if self:checkExistInCache(relativePath, imgmd5, uniqueFolder) then
            self:copyPngFromCache(imgPath, uniqueFolder, relativePath)
        else
            table.insert(fileList, imgPath)
            table.insert(md5List, {imgPath=imgPath,
                relativePath=relativePath, imgmd5=imgmd5, 
                uniqueFolder=uniqueFolder})
        end
    end

    local filelistPath = _F("%s/file_list_to_compress.txt", self:getCachePath())
    os.mkdir(self:getCachePath())
    if #fileList > 0 then
        local file = io.open(filelistPath, "w")
        for _, img in ipairs(fileList) do
            file:write(img)
            file:write("\n")
        end
        file:close()
        TinyPng:convertPngByFilelist(filelistPath)
    end
    os.remove(filelistPath)

    for _, info in ipairs(md5List) do
        self:backupPngToCache(info.imgPath, info.uniqueFolder, info.relativePath)
        self:_saveMd5(info.relativePath, info.imgmd5, info.uniqueFolder)
    end
end

-- frontPath: 全路径中要排除的部分  和files_manifest.lua中保持一致
function Png8Cache:convertPng(imgPath, frontPath)
    imgPath = os.fixPath(imgPath, false)
    frontPath = os.fixPath(frontPath, true)
    local relativePath = string.cutsub(imgPath, frontPath)

    local uniqueFolder = self:_frontPathToFolderName(frontPath)
    local imgmd5 = md5.sumFile(imgPath)
    if self:checkExistInCache(relativePath, imgmd5, uniqueFolder) then
        self:copyPngFromCache(imgPath, uniqueFolder, relativePath)
    else
        TinyPng:convertPng(imgPath)
        self:backupPngToCache(imgPath, uniqueFolder, relativePath)
        self:_saveMd5(relativePath, imgmd5, uniqueFolder)
    end
end

--将前置路径转为 唯一的文件夹名来保存缓存文件
function Png8Cache:_frontPathToFolderName(frontPath)
    local s = string.gsub(frontPath, "%.%./", "")
    s = string.gsub(s, ":", "")
    s = string.gsub(s, "/", "_")
    return s
end

function Png8Cache:copyPngFromCache(imgPath, uniqueFolder, relativePath)
    local from = _F("%s/%s/%s", self:getCachePath(), uniqueFolder, relativePath) 
    local to = os.dirname(imgPath)
    -- print("copyPngFromCache", imgPath, from, to)
    os.copyfile(from, to)
end

function Png8Cache:backupPngToCache(imgPath, uniqueFolder, relativePath)
    local to = _F("%s/%s/%s", self:getCachePath(), uniqueFolder, relativePath) 
    -- print("backupPngToCache", imgPath, to)
    os.copyfile(imgPath, to)
end

function Png8Cache:checkExistInCache(relativePath, md5Value, uniqueFolder)
    -- print("check md5", relativePath, md5Value, uniqueFolder)
    local t = self._filesMd5[uniqueFolder] or {}
    return t[relativePath] == md5Value
end

function Png8Cache:_saveMd5(relativePath, md5Value, uniqueFolder)
    -- print("savemd5", relativePath, md5Value, uniqueFolder)
    local t = self._filesMd5[uniqueFolder] or {}
    self._filesMd5[uniqueFolder] = t
    
    t[relativePath] = md5Value
    self:_saveManifest()
end

function Png8Cache:_readManifest()
    local path = self:getFilesManifestPath()
    if not os.exist(path) then
        self._filesMd5 = {}
        return
    end

    self._filesMd5 = io.readLuaFile(path)
end

function Png8Cache:_saveManifest()
    local path = self:getFilesManifestPath()
    
    local filter = function (text)
        text = _A2U(text)
        return "return " .. text
    end
    io.writeLuaFile(path, self._filesMd5, filter)
end

function Png8Cache:getCachePath()
    return _F("%s/%s/", self._toolPath, CACHE_TEMP_PATH)
end

function Png8Cache:getFilesManifestPath()
    return _F("%s/%s", self:getCachePath(), MANIFEST_FILE)
end



return Png8Cache

