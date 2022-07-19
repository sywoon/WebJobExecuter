@echo off

set "rootpath=%1"


pushd "%rootpath%/shj_client_git"
call rd /s /q bin\js_temp 2>nul
call mkdir bin\js_temp
call rd /s /q bin\js 2>nul
call mkdir bin\js

echo "编译ts..."
call tsc -p .

echo "生成bundle.js..."
:: delay:0 mode:3 translate=1
call ./compile.bat 0 3 1
popd

::echo "扫描模型..."
::pushd "%rootpath%/shj_client_git/tools/scanModelRes/"
::call run_nopause.bat
::popd

::echo "压缩库..."
::pushd "%rootpath%/shj_client_git/tools/compress_js/"
::call run.bat ../../bin/js/bundle.js ../../bin/js/bundle.js
::call run.bat ../../bin/js/layalibs.js ../../bin/js/layalibs.js
::popd


echo "同步到UI工程..."
pushd "%rootpath%/shj_client_git/tools/sync_bin/"
call run.bat
popd


