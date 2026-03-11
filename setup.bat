@echo off
REM Sci-Fi SoundBoard — full setup (Windows)
REM Detects OS, installs dependencies, downloads sounds (GitHub Release or FREESOUND_API_KEY).
REM Run from repo root: setup.bat
REM Optional: setup.bat --skip-sounds  (synth-only, no sound download)

cd /d "%~dp0"

echo === Sci-Fi SoundBoard Setup ===
echo OS:     Windows
echo Arch:   %PROCESSOR_ARCHITECTURE%
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not in PATH.
  echo Install Node.js 18+ from https://nodejs.org and run this script again.
  exit /b 1
)

for /f "tokens=*" %%v in ('node -v 2^>nul') do set NODE_VER=%%v
echo Node:   %NODE_VER%
echo.

REM Pass all args (e.g. --skip-sounds) so behavior matches setup.sh
node scripts\full-setup.js %*
if errorlevel 1 exit /b 1

echo.
echo Done. Run start.bat or "npm start" to launch the app.
