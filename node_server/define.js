
//业务数据相关key 存放在logic中
let VO = {
    DATA_PROJ_STATUS : "DATA_PROJ_STATUS",  //项目状态数据
}


let PLUGIN_TYPE = {
    FILE : "FILE",
    CMD : "CMD",
    STATUS : "STATUS",
}

let JOB_CODE = {
    CMD_UPDATE_CLIENT: 1,
    CMD_SYNC_ART_RES: 2, //同步美术资源
    
    //状态命令
    STATUS_PROJECT: 101,
    STATUS_RESET_STATUS: 102,

    //文件命令
    FILE_READ_CONFIG: 201,
}

let CMD_ERROR = {
    COMMON : -1,
    BUSY : -2,
    CMD_LOST : -3,
}

let PROJECT_STATUS = {
    NONE : 0,
    PREPARE : 1,
    EXPORT_EXCEL : 2,
    EXPORT_PROTOL : 3,
    EXPORT_UI : 4,
    COMPILE_CLIENT : 5,
    SYNC_ART_RES : 6,
    ERROR : 100,
}



module['exports'] = {VO, PLUGIN_TYPE, JOB_CODE, CMD_ERROR, PROJECT_STATUS}