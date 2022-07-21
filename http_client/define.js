
export let Define = {
    MAX_QUEUE_LEN : 3,
    TOOL_FOLDER_NAME : "WebJobExecuter",
    PROJ_STATUS_UPDATE_INTERVEL : 6000,   //项目状态更新节奏

    VO : {  //业务数据相关key 存放在logic中
        "DATA_PROJ_STATUS" : "DATA_PROJ_STATUS",  //项目状态数据
    },
}

export let PLUGIN_TYPE = {
    "FILE" : "FILE",
    "CMD" : "CMD",
    "STATUS" : "STATUS",
}

//更新工具中 记录当前操作类型
export let UPDATE_CMD_TYPE = {
    UPDATE_CLIENT : 1,
    SYNC_ART_RES : 2, 
}

export let JOB_CODE = {
    CMD_UPDATE_CLIENT: 1,
    CMD_SYNC_ART_RES: 2, //同步美术资源
    

    //状态命令
    STATUS_PROJECT: 101,
    STATUS_RESET_STATUS: 102,

    //文件命令
    FILE_READ_CONFIG: 201,
}

export let ASYNC_JOB = {
    [JOB_CODE.CMD_UPDATE_CLIENT] : true,
    [JOB_CODE.CMD_SYNC_ART_RES] : true,
}

export let CMD_ERROR = {
    "COMMON" : -1,
    "BUSY" : -2,
    "CMD_LOST" : -3,
    "UNKNOW" : -100,
}

export let EVT_HTTP_CLIENT = {
    "DATA_QUEUE_CHG" : "DATA_QUEUE_CHG",
    "SERVER_BUSY" : "SERVER_BUSY",
}

export let EVT_LOGIC = {
    "PROJ_STATUS_UPDATE" : "PROJ_STATUS_UPDATE", 
}

export let PROJECT_STATUS = {
    NONE : 0,
    PREPARE : 1,
    EXPORT_EXCEL : 2,
    EXPORT_PROTOL : 3,
    EXPORT_UI : 4,
    COMPILE_CLIENT : 5,
    COMPRESS_IMAGE : 6,

    SYNC_ART_RES : 20,
    COMPRESS_SPINE : 21,

    ERROR : 100,
}
