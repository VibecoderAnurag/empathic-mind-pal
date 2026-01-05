@echo off
echo ========================================
echo Starting Empathic Mind Pal Project
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/3] Starting Text Emotion API (Port 8000)...
start "Text Emotion API - Port 8000" cmd /k "cd /d %~dp0ml && python api_server.py"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Facial Emotion API (Port 8001)...
start "Facial Emotion API - Port 8001" cmd /k "cd /d %~dp0ml && python facial_emotion_api.py"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend Dev Server (Port 8080)...
start "Frontend Dev Server - Port 8080" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo All servers are starting!
echo ========================================
echo.
echo Text Emotion API: http://localhost:8000
echo Facial Emotion API: http://localhost:8001
echo Frontend: http://localhost:8080
echo.
echo Wait 10-15 seconds for servers to initialize...
echo.
echo You can test the APIs:
echo   - Text API: http://localhost:8000/health
echo   - Facial API: http://localhost:8001/health
echo.
echo Press any key to exit this window (servers will keep running)
pause >nul

