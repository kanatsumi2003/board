start .\script-config.bat

start .\script-app.bat

timeout 5 > NUL

start msedge.exe --kiosk http://localhost:3000 --edge-kiosk-type=fullscreen --no-first-run --disable-pinch
