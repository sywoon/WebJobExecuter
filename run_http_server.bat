@echo off
cls
set "title_name=http_server"

$Host.UI.RawUI.WindowTitle = %title_name% 2>nul
TITLE %title_name% 2>nul

start http://192.168.30.40:9100/WebJobExecuter/http_client/index.html

pushd "%~dp0../"
cmd "http-server" /c anywhere -s 9100
popd





