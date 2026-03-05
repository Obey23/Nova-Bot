@echo off
setlocal enabledelayedexpansion

:startup
node .

if %ERRORLEVEL% EQU 0 goto shutdown
echo Node exited with code %ERRORLEVEL%

echo Checking for updates before restarting...
git fetch origin main >nul 2>&1
for /f %%i in ('git rev-parse HEAD') do set LOCAL=%%i
for /f %%i in ('git rev-parse origin/main') do set REMOTE=%%i
if not "!LOCAL!"=="!REMOTE!" (
    echo Update found on Github, downloading...
    git pull origin main
    
    echo Updating Packages...
    npm i
)
echo Restarting in 3 seconds...
timeout /t 3 >nul
goto startup

:shutdown
echo Bot shutting down, bye bye
timeout /t -1