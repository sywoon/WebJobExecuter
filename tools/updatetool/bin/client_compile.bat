@echo off

set "rootpath=%1"


pushd "%rootpath%/shj_client_git"
call rd /s /q bin\js_temp 2>nul
call mkdir bin\js_temp
call rd /s /q bin\js 2>nul
call mkdir bin\js

echo "����ts..."
call tsc -p .

echo "����bundle.js..."
:: delay:0 mode:3 translate=1
call ./compile.bat 0 3 1
popd

::echo "ɨ��ģ��..."
::pushd "%rootpath%/shj_client_git/tools/scanModelRes/"
::call run_nopause.bat
::popd

::echo "ѹ����..."
::pushd "%rootpath%/shj_client_git/tools/compress_js/"
::call run.bat ../../bin/js/bundle.js ../../bin/js/bundle.js
::call run.bat ../../bin/js/layalibs.js ../../bin/js/layalibs.js
::popd


echo "ͬ����UI����..."
pushd "%rootpath%/shj_client_git/tools/sync_bin/"
call run.bat
popd


