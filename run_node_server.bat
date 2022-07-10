@echo off
set "title_name=node_server"

$Host.UI.RawUI.WindowTitle = %title_name% 2>nul
TITLE %title_name% 2>nul

::rd /s/q %~dp0log


set "usewt=0"
call :START_BY_MT usewt
if %usewt% == 11 call wt --title %title_name% %0 %* && goto :eof

pushd "%~dp0/node_server/"
::start "node-server" /min cmd /c node src/node_server.js
cmd /c node ./node_main.js %~dp0node_server/ %~dp0
popd





:START_BY_MT
if not exist "C:\\Users\\%USERNAME%\\AppData\\Local\\Microsoft\\WindowsApps\\wt.exe" (
    set "%~1=0"  
    goto :eof
)

if defined __wtflag goto :eof
set __wtflag=1   必须 否则下次wt启动时 会继续启动下一个wt
set "%~1=1"  
goto :eof