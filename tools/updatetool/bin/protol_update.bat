@echo off

set "rootpath=%1"
set "gitbranch=%2"

pushd "%rootpath%/tools/protocol"
call pull_protocol.bat %gitbranch%
popd
