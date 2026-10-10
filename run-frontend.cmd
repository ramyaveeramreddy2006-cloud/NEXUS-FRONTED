@echo off
setlocal
cd /d "%~dp0"
echo ============================================
echo NEXUS Frontend - Windows
echo ============================================
curl.exe -fsS --max-time 2 http://localhost:5173/ >nul 2>&1
if not errorlevel 1 (
  echo NEXUS frontend is already running at http://localhost:5173
  endlocal
  exit /b 0
)
if not exist node_modules (
  echo Installing frontend dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)
echo Starting Vite development server...
call npm run dev
endlocal
