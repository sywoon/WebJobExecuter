


anywhere 9100
   index.html
   main.js  -- ts export es6
      | http_request
      | proj_view  Ò³ÃæÄÚÈÝ
      | pluginMgrClient
        | plugin_file_sync
        | plugin_status_sync
        | plugin_job_group_sender



node main.js  -- ts export commonjs
        | createHttp(request, response)
        | pluginMgrSvr
            | plugin_file_sync
            | plugin_status_sync
            | plugin_cmd_sync
                | job_group_executer
                    | job_cmd
                






