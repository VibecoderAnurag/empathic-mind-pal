@echo off
REM Training script with absolute path
cd /d "C:\Users\anura\Desktop\first zip\capstone project\empathic-mind-pal\ml"

echo ========================================
echo HIGH-ACCURACY TRAINING
echo ========================================
echo.
echo Directory: %CD%
echo.

REM Verify files exist
if not exist "train_facial_emotion_torch.py" (
    echo ERROR: train_facial_emotion_torch.py not found!
    echo Expected: %CD%\train_facial_emotion_torch.py
    pause
    exit /b 1
)

if not exist "FER2013" (
    echo ERROR: FER2013 dataset not found!
    echo Expected: %CD%\FER2013
    pause
    exit /b 1
)

echo Files verified. Starting training...
echo.
echo Configuration:
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
echo.
echo Best model: checkpoints\best_model.pth
echo Final model: checkpoints\facial_emotion_model_torch.pth
echo.
pause

