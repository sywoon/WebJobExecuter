@echo off

set "rootpath=%1"
set "gitbranch=%2"

pushd "%rootpath%/shj_client_git"
git checkout .
git checkout %gitbranch% 
git clean -fd
git pull origin %gitbranch% 
popd

