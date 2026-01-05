@echo off
echo ========================================
echo Starting All Servers
echo ========================================
echo.

echo [1/3] Starting Text Sentiment API (Port 8000)...
start "Text Sentiment API" cmd /k "cd /d %~dp0ml && python api_server.py"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Facial Emotion API (Port 8001)...
start "Facial Emotion API" cmd /k "cd /d %~dp0ml && python facial_emotion_api.py"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend (Port 5173)...
start "Frontend Dev Server" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo All servers are starting!
echo ========================================
echo.
echo Text Sentiment API: http://localhost:8000
echo Facial Emotion API: http://localhost:8001
echo Frontend: http://localhost:5173
echo.
echo Wait a few seconds for servers to initialize...
echo Press any key to exit this window (servers will keep running)
pause >nul

