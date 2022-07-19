@echo off

set "rootpath=%1"


pushd "%rootpath%/tools/data"
call export-client-git-auto.bat
popd

