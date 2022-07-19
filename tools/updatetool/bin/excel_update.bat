@echo off

set "rootpath=%1"

pushd "%rootpath%/excel"
svn update
::svn info
popd

