@echo off
REM This script MUST be run from the ml\ directory
REM It changes to its own directory first
cd /d %~dp0

echo ========================================
echo HIGH-ACCURACY TRAINING
echo ========================================
echo.
echo Current directory: %CD%
echo.
echo Verifying script exists...
if not exist "train_facial_emotion_torch.py" (
    echo ERROR: train_facial_emotion_torch.py not found!
    echo Make sure you're running this from the ml\ directory.
    pause
    exit /b 1
)
echo Script found! Starting training...
echo.
echo Training configuration:
echo   Model: EfficientNet-B0
echo   Epochs: 80
echo   Batch Size: 16
echo   Input Size: 224x224
echo   GPU: Enabled
echo.
echo This will take 2-4 hours...
echo.
pause

python train_facial_emotion_torch.py --model efficientnet_b0 --epochs 80 --batch-size 16 --input-size 224 --lr 1e-4 --weight-decay 1e-4 --scheduler cosine --patience 10 --use-amp --mixup 0.2 --label-smoothing 0.1 --num-workers 4

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo ERROR OCCURRED!
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

