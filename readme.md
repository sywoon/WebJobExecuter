# web端任务执行器
目标：远程执行具体任务 本地通过web页面操作和展现状态进度
* 远程执行具体任务组 可由多个子任务组成
* web端采用任务队列方式 可连续执行多个任务
* web端同步任务状态 展示给使用者

## 案例
* 远程编译ui+客户端代码 避免权限问题
* 远程运行最新h5端; 若为u3d 可将最新的编译版本上传svn 策划手动更新到自己的电脑
* 远程自动打热更包
* 远程自动同步美术资源

```
anywhere 9100
   index.html
   main.js  -- ts export es6
      | http_request
      | proj_view  页面内容
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
                

```




