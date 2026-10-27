@echo off
setlocal
echo ========================================================
echo   Launching AI Career Guidance Full-Stack Application
echo ========================================================

REM Add bundled portable Node.js to PATH
set "PATH=%~dp0..\tools\node-v20.18.0-win-x64;%PATH%"

echo Starting unified server on http://localhost:5000 ...
cd /d "%~dp0server"
node src\index.js

pause
