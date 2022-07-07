@echo off

set port=9001
echo port : %port%

:: find pid
netstat -ano | findstr "%port%"

:: find process
::tasklist|findstr "9088"

::kill process
::taskkill /T /F /PID 9088 

pause








