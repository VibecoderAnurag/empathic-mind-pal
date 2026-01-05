@echo off
echo Starting ML API Server...
echo.
echo This will start the FastAPI server on http://localhost:8000
echo.
echo Make sure you have:
echo 1. Python installed
echo 2. All dependencies installed (pip install -r requirements.txt)
echo 3. The model trained and saved in checkpoints/best_model/
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
python api_server.py
pause

