@echo off
REM Quick setup script for facial emotion model training

echo ========================================
echo Facial Emotion Model Setup
echo ========================================
echo.

REM Check if fer2013.csv exists
if not exist "fer2013.csv" (
    echo [ERROR] fer2013.csv not found!
    echo.
    echo Please download FER2013 dataset:
    echo 1. Go to: https://www.kaggle.com/datasets/msambare/fer2013
    echo 2. Download fer2013.csv
    echo 3. Place it in the ml/ directory
    echo.
    pause
    exit /b 1
)

echo [OK] fer2013.csv found
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found!
    echo Please install Python 3.8+
    pause
    exit /b 1
)

echo [OK] Python found
echo.

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [OK] Dependencies installed
echo.

REM Create directories
if not exist "checkpoints" mkdir checkpoints
if not exist "model" mkdir model

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: python train_facial_emotion.py
echo 2. After training, copy model files:
echo    xcopy /E /I model\* ..\public\ml\model\
echo.
pause

