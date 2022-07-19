@echo off

set "rootpath=%1"

pushd "%rootpath%/shj_client_git/bin"
rd /s /q comp 1>nul
rd /s /q prefab 1>nul
rd /s /q ui 1>nul
rd /s /q ui_langs 1>nul
rd /s /q view 1>nul
rd /s /q res\\atlas 1>nul
popd

pushd "%rootpath%/shj_uiedit_git"
call layaair2-cmd ui -c -a -d -m normal 
popd

pushd "%rootpath%/shj_client_git/tools/fix_max_ui"
call run.bat
popd