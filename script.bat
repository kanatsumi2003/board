@echo off

set LOCKER_APP_PORT=3000

set app_dir="./locker-app"

cd %app_dir%

call npm install -g yarn

call yarn

echo Starting Locker client app

call yarn dev --port %LOCKER_APP_PORT%

start http://localhost:3000
