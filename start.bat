start .\script-config.bat

start .\script-app.bat

timeout 5 > NUL

start http://localhost:3000
