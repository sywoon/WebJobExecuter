@echo off

set "path=%~dp0/../lua5.3/;%path%"

echo %1  ::mode  1:update_all 2:sync_res
echo %2  ::project name
echo %3  ::project path
echo %4  ::branch
echo %5  ::update_dynamic_status.txt path

call runlua Main.lua %~dp0 %1 %2 %3 %4 %5




