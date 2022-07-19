@echo off

if "%3" == "" (
    echo param error!
    pause && goto :eof
)

::echo %1  ::project name
::echo %2  ::project path
::echo %3  ::branch

:: mode 1:update_all 2:sync_res
set mode=1


pushd "%~dp0/updatetool"
call run.bat %mode% %1 %2 %3 "%~dp0/../config/update_dynamic_status.json"
popd

