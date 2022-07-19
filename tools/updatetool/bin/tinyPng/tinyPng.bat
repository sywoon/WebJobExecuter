@echo off

set "path=C:\Program Files\Adobe\Adobe Photoshop 2020;C:\Program Files\Adobe\Adobe Photoshop CS6 (64 Bit);%path%"
set "mode=%1"   :: 1文件夹 2文件


::echo %time%
::echo %*

:: %2 path
echo %mode%,%2>%~dp0cfg.txt

call Photoshop.exe %~dp0tinyPng.jsx

del /F/Q %~dp0cfg.txt
::echo %time%


