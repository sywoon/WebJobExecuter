@echo off


if "%1" NEQ "%2" (
	%~dp0jsmin <%1 >%2
	goto :eof
)

%~dp0jsmin <%1 >%~dpnx1.min
del /f /q %~dpnx1
rename %~dpnx1.min %~nx1
