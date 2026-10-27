@echo off
chcp 65001 >nul
title CareerAI — AI Career Guidance Platform
color 0B

echo ===================================================================
echo     🚀 Starting CareerAI — Full-Stack AI Career Guidance
echo ===================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "NODE_EXE=%SCRIPT_DIR%..\tools\node-v20.18.0-win-x64\node.exe"

if not exist "%NODE_EXE%" (
    set "NODE_EXE=%SCRIPT_DIR%tools\node-v20.18.0-win-x64\node.exe"
)

if not exist "%NODE_EXE%" (
    where node >nul 2>&1
    if %errorlevel% equ 0 (
        set "NODE_EXE=node"
    ) else (
        echo [ERROR] Portable Node.js not found.
        pause
        exit /b 1
    )
)

echo [1/3] Found Node Runtime: %NODE_EXE%
cd /d "%SCRIPT_DIR%server"

echo [2/3] Starting backend server on http://localhost:5000...
echo [3/3] Opening application in your default web browser...

:: Wait 1.5 seconds then launch browser
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5000"

echo.
echo ===================================================================
echo  App is live! Keep this window open while using CareerAI.
echo  To stop the application, simply close this command window.
echo ===================================================================
echo.

"%NODE_EXE%" src/index.js

pause
