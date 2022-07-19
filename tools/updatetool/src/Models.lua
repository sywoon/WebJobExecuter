local ProjectModel = require "ProjectModel"

local Models = {}


function Models:registerAll()
    local objs = {}
    objs["project"] = ProjectModel.new()

    rawset(_G, "models", objs)
end




return Models