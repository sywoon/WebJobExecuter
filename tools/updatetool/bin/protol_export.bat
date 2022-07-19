@echo off

set "rootpath=%1"
set "gitbranch=%2"

pushd "%rootpath%/tools/protocol"
call gen_erl_msg_client_git.bat %gitbranch%
popd

