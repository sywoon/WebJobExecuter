@echo off


pushd %~dp0
::call run_one_jsmin.bat %1
call run_uglify_one.bat %1
popd

