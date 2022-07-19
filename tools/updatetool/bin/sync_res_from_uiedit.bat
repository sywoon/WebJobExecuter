@echo off

set "rootpath=%1"
set "client=%rootpath%\shj_client_git"
set "uiedit=%rootpath%\shj_uiedit_git"


echo %client%
echo %uiedit%

pushd "%client%"
git clean -fd
git checkout .
git pull
popd

::export ui_lang.json uidata_lang.json
pushd "%client%\tools\multi_ui_lang"
    call export_langs_uidata.bat
    call export_langs_ui.bat
popd
copy /Y "%client%\tools\multi_ui_lang\lang\uidata_lang.json" "%client%\bin\res\lang/"
copy /Y "%client%\tools\multi_ui_lang\lang\ui_lang.json" "%client%\bin\res\lang/"
copy /Y "%uiedit%\bin\res\gWarMapCfg.json" "%client%\bin\res\"

:: export common_ui_list.json
pushd "%client%\tools\compile"
call export_common_ui.bat
popd

:: sync all res from uiedit to client
pushd "%client%\tools\file_sync"
    call sync_ui_res.bat
popd

:: compress sk to png8
pushd "%client%\tools\image_scale_size"
    call sync_res_sk_scale.bat
popd

pushd "%client%"
git add .
git commit -a -m "sync res"
git push
popd

