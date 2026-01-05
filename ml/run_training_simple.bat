@echo off
cd /d %~dp0
echo ========================================
echo HIGH-ACCURACY TRAINING
echo ========================================
echo.
echo Starting training...
echo.

python train_facial_emotion_torch.py --model efficientnet_b0 --epochs 80 --batch-size 16 --input-size 224 --lr 1e-4 --weight-decay 1e-4 --scheduler cosine --patience 10 --use-amp --mixup 0.2 --label-smoothing 0.1 --num-workers 4

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo ERROR OCCURRED!
    echo ========================================
    echo.
    echo Check the error messages above.
    echo.
    pause
)

