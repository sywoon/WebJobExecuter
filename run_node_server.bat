@echo off
set "title_name=node_server"

$Host.UI.RawUI.WindowTitle = %title_name% 2>nul
TITLE %title_name% 2>nul

::rd /s/q %~dp0log

pushd "%~dp0/node_server/"
::start "node-server" /min cmd /c node src/node_server.js
cmd /c node ./node_main.js %~dp0node_server/ %~dp0
popd
