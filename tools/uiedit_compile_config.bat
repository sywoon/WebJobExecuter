@echo off

if "%2" == "" (
    echo param error!
    pause && goto :eof
)

::echo %1  ::filename
::echo %2  ::project path


pushd "%2/shj_uiedit_git"
copy laya\%1 laya\.laya
popd

