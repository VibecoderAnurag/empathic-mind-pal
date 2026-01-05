@echo off
echo ========================================
echo Quick Retrain - Improved Model
echo ========================================
echo.
echo This will retrain with better settings:
echo   - 80 epochs (more training)
echo   - Better learning rate
echo   - Enhanced augmentation
echo.
echo Training time: 2-4 hours (CPU) or 30-60 min (GPU)
echo.
pause

python train_facial_emotion_torch.py --epochs 80 --batch-size 64 --lr 0.001 --patience 10

echo.
echo ========================================
echo Training Complete!
echo ========================================
echo.
echo New model saved to: checkpoints\facial_emotion_model_torch.pth
echo.
echo Restart the API server to use the new model:
echo   python facial_emotion_api.py
echo.
pause

