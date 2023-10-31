@echo off

set locker_client_dir="locker-app"

@REM @REM START LOCKER CLIENT APP
set BROWSER=chrome

set LOCKER_APP_PORT=3000

cd .\%locker_client_dir%

call npm install -g yarn

call yarn

call yarn dev --port %LOCKER_APP_PORT%

