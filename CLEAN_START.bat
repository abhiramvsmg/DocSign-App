@echo off
echo ========================================
echo  DocSign App - Clean Startup Script
echo ========================================
echo.

echo [1/4] Killing all existing processes...
taskkill /F /IM uvicorn.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM python.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Starting Backend on 127.0.0.1:8000...
start "DocSign Backend" cmd /k "cd /d %~dp0 && uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload --reload-dir backend"
timeout /t 5 /nobreak >nul

echo [3/4] Starting Frontend on localhost:5173...
start "DocSign Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo [4/4] Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================
echo  ✅ DocSign App is running!
echo  Backend:  http://127.0.0.1:8000
echo  Frontend: http://localhost:5173
echo  
echo  Login: abhiram@gmail.com
echo  Password: password123
echo ========================================
echo.
pause
