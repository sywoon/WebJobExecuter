@echo off


%~dp0jsmin <%1 >%~dpnx1.min
del /f /q %~dpnx1
rename %~dpnx1.min %~nx1
