@echo off
REM Change to script directory
cd /d %~dp0

echo ========================================
echo HIGH-ACCURACY TRAINING - AUTO START
echo ========================================
echo.
echo Starting training from: %CD%
echo.

python auto_train.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo ERROR: Training failed!
    echo ========================================
    echo.
    echo Check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Training completed successfully!
echo ========================================
pause

