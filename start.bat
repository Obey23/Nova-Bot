@echo off
setlocal enabledelayedexpansion

goto update
:startup
set "RESTART="
node .

if %ERRORLEVEL% EQU 0 goto shutdown
echo Node exited with code %ERRORLEVEL%
set RESTART=true
echo Checking for updates before restarting...

:update
git fetch origin main >nul 2>&1
for /f %%i in ('git rev-parse HEAD') do set LOCAL=%%i
for /f %%i in ('git rev-parse origin/main') do set REMOTE=%%i
if not "!LOCAL!"=="!REMOTE!" (
    echo Update found on Github, downloading...
    git pull origin main
    
    echo Updating Packages...
    start "" /min cmd /c "npm i >nul 2>&1"
)
if not "!RESTART!" EQU "true" goto startup
echo Restarting in 3 seconds...
timeout /t 3 >nul
goto startup

:shutdown
echo Bot shutting down, bye bye