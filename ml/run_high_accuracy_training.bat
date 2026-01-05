@echo off
cd /d %~dp0
echo ========================================
echo HIGH-ACCURACY TRAINING PIPELINE
echo ========================================
echo.
echo Current directory: %CD%
echo.
echo This will train with:
echo   - EfficientNet-B0 (or ResNet50)
echo   - Input size: 224x224
echo   - Mixup: 0.2
echo   - Label Smoothing: 0.1
echo   - 80 epochs
echo   - GPU optimized
echo.
echo Training time: 2-4 hours (GPU) or 8-12 hours (CPU)
echo.
pause

python train_facial_emotion_torch.py ^
    --model efficientnet_b0 ^
    --data-dir FER2013 ^
    --save-dir checkpoints ^
    --epochs 80 ^
    --batch-size 16 ^
    --input-size 224 ^
    --optimizer AdamW ^
    --lr 1e-4 ^
    --weight-decay 1e-4 ^
    --scheduler cosine ^
    --patience 10 ^
    --use-amp ^
    --mixup 0.2 ^
    --label-smoothing 0.1 ^
    --num-workers 4

echo.
echo ========================================
echo Training Complete!
echo ========================================
echo.
echo Best model saved to: checkpoints\best_model.pth
echo Final model saved to: checkpoints\facial_emotion_model_torch.pth
echo.
echo Restart the API server to use the new model:
echo   python facial_emotion_api.py
echo.
pause

