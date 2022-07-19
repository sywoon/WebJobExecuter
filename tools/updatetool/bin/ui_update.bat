@echo off

set "rootpath=%1"
set "gitbranch=%2"

pushd "%rootpath%/shj_uiedit_git"
git checkout .
git checkout %gitbranch% 
git pull origin %gitbranch% 
popd

