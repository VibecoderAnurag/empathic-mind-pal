# Retraining Guide for Better Accuracy

## Current Model Performance
- **Test Accuracy**: ~56%
- **Validation Accuracy**: ~67%
- **Status**: Needs improvement

## Quick Retrain Options

### Option 1: Quick Retrain (Recommended)
Run the batch file:
```bash
cd ml
quick_retrain.bat
```

Or manually:
```bash
python train_facial_emotion_torch.py --epochs 80 --batch-size 64 --lr 0.001 --patience 10
```

### Option 2: Extended Training (Best Accuracy)
For maximum accuracy, train longer:
```bash
python train_facial_emotion_torch.py --epochs 100 --batch-size 64 --lr 0.0008 --patience 15
```

## Expected Improvements

After retraining, you should see:
- **Target Accuracy**: 70-75%+ (up from 56%)
- **Better emotion detection** in real-time
- **More consistent predictions**

## Training Time
- **CPU**: 2-4 hours
- **GPU**: 30-60 minutes

## After Training

1. The new model will be saved to: `checkpoints/facial_emotion_model_torch.pth`
2. **Restart the API server** to use the new model:
   ```bash
   python facial_emotion_api.py
   ```
3. Test the improved accuracy in your browser

## Tips for Better Accuracy

1. **More Training Data**: If you have more facial emotion images, add them to FER2013/train/
2. **Longer Training**: More epochs = better accuracy (but diminishing returns after ~100 epochs)
3. **Better Lighting**: Ensure good lighting when using webcam
4. **Face Detection**: Make sure your face is clearly visible and centered

## Troubleshooting

If accuracy doesn't improve:
- Check if dataset is properly loaded
- Verify image preprocessing matches training
- Try different learning rates (0.0005 to 0.002)
- Increase model capacity (more layers/filters)

