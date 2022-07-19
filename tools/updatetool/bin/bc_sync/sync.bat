@echo off

set "path=C:\Program Files (x86)\Beyond Compare 4;C:\Program Files\Beyond Compare 4;D:\Program Files (x86)\Beyond Compare 4;D:\Program Files\Beyond Compare 4;%path%"

::set bcomp="C:\Program Files (x86)\Beyond Compare 4\BComp.com"
set "from=%1"
set "to=%2"
set "mode=%3"  ::1���޸�  2�޸�+���� 3����
set "silent=%4" ::1���� 0�ر�

if "%mode%" == "" (
    set "mode=2"
)

if "%silent%" == "" (
    set "silent=1"
)

if "%silent%" == "1" (
    set "silent_str=/silent"
)

set file_script="%~dp0script.txt"

if not exist %from% (
	echo [ͬ������]Դ·�������ڣ� %from%
	pause & goto :eof
)

if not exist %to% (
	echo [ͬ������]Ŀ��·�������ڣ� %to%
	pause & goto :eof
)

if "%mode%" == "1" (
    BComp.com %silent_str% /qc=crc @"%~dp0sync_only_new.txt"
    goto :eof
)

if "%mode%" == "2" (
    BComp.com %silent_str% /qc=crc @"%~dp0sync_new_orphans.txt"
    goto :eof
)

if "%mode%" == "3" (
    BComp.com %silent_str% @"%~dp0sync_mirror.txt"
    goto :eof
)

