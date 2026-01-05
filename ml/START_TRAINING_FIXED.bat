@echo off
REM Ensure we're in the correct directory
cd /d %~dp0

echo ========================================
echo HIGH-ACCURACY TRAINING - FIXED
echo ========================================
echo.
echo Current directory: %CD%
echo.
echo Starting training with:
echo   Model: EfficientNet-B0
echo   Epochs: 80
echo   Batch Size: 16
echo   Input Size: 224x224
echo   GPU Optimized: Yes
echo.
echo This will take 2-4 hours on GPU...
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
    echo Make sure you're running this from the ml\ directory.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Training completed successfully!
echo ========================================
echo.
echo Best model saved to: checkpoints\best_model.pth
echo Final model saved to: checkpoints\facial_emotion_model_torch.pth
echo.
pause

