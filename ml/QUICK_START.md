# Quick Start - High-Accuracy Training

## 🚀 Start Training (3 Easy Ways)

### Method 1: Double-Click (Easiest)
1. Navigate to: `capstone project/empathic-mind-pal/ml/`
2. Double-click: `START_TRAINING.bat`
3. Training will start automatically!

### Method 2: Command Line
```bash
cd "capstone project/empathic-mind-pal/ml"
python auto_train.py
```

### Method 3: Direct Training
```bash
cd "capstone project/empathic-mind-pal/ml"
python train_facial_emotion_torch.py \
    --model efficientnet_b0 \
    --epochs 80 \
    --batch-size 16 \
    --input-size 224 \
    --lr 1e-4 \
    --weight-decay 1e-4 \
    --scheduler cosine \
    --patience 10 \
    --use-amp \
    --mixup 0.2 \
    --label-smoothing 0.1 \
    --num-workers 4
```

## 📊 What You'll See

The training will show:
- GPU/CPU detection
- Dataset loading progress
- Model creation info
- Real-time training metrics:
  - Loss and accuracy per epoch
  - GPU memory usage
  - Batch processing time
  - Learning rate schedule

## ⏱️ Training Time

- **GPU**: 2-4 hours
- **CPU**: 8-12 hours

## ✅ After Training

Models will be saved to:
- `checkpoints/best_model.pth` - Best model (highest accuracy)
- `checkpoints/facial_emotion_model_torch.pth` - Final model for API

## 🔄 Resume Training

If interrupted, resume with:
```bash
python train_facial_emotion_torch.py --resume checkpoints/last_checkpoint.pth [other args]
```

## 🐛 Troubleshooting

**Error: Can't find file**
- Make sure you're in the `ml/` directory
- Use `cd "capstone project/empathic-mind-pal/ml"` first

**GPU Out of Memory**
- Script auto-reduces batch size
- Or manually use `--batch-size 8`

**Dataset Not Found**
- Ensure `FER2013/train/` and `FER2013/test/` exist in the `ml/` directory

