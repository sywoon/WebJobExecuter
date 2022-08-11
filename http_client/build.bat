call rollup -c

call ../tools/compress_js/run_one.bat %~dp0main.min.js

move main.min.js ../http_client_dist/



pause
