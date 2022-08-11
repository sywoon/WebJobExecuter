@echo off


pushd %~dp0
::call run_jsmin.bat %1 %2
call run_uglify.bat %1 %2
popd



