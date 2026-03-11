@echo off
REM Sci-Fi SoundBoard — start the app (Windows)
REM Run from repo root: start.bat

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not in PATH. Run setup.bat first.
  exit /b 1
)

if not exist "systems\soundboard-app\node_modules" (
  echo Dependencies not installed. Run setup.bat first.
  exit /b 1
)

call npm start
if errorlevel 1 exit /b 1
