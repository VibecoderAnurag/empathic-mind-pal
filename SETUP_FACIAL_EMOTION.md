# Facial Emotion Detection - Setup Guide

## ✅ Current Status

- ✅ Training script created (`ml/train_facial_emotion.py`)
- ✅ React component created (`src/components/FacialEmotionDetector.tsx`)
- ✅ Demo page created (`src/pages/FacialEmotion.tsx`)
- ✅ TensorFlow.js dependency added to package.json
- ✅ Routes configured
- ⏳ Model training (next step)
- ⏳ Model deployment (after training)

## 🚀 Next Steps

### Step 1: Install Python Dependencies

```bash
cd ml
pip install -r requirements.txt
```

This will install:
- TensorFlow 2.13+
- TensorFlow.js converter
- Pandas, Matplotlib, Seaborn
- Other ML dependencies

### Step 2: Download FER2013 Dataset

**Option A: From Kaggle (Recommended)**
1. Go to: https://www.kaggle.com/datasets/msambare/fer2013
2. Click "Download" (requires Kaggle account)
3. Extract `fer2013.csv` to `ml/` directory

**Option B: Direct Download**
- The dataset is ~87 MB
- Place `fer2013.csv` in the `ml/` folder

**Dataset Structure:**
- Training: 28,709 images
- Validation: 3,589 images  
- Test: 3,589 images
- Total: 35,887 grayscale 48x48 images
- 7 emotion classes: angry, disgust, fear, happy, sad, surprise, neutral

### Step 3: Train the Model

```bash
cd ml
python train_facial_emotion.py
```

**What happens:**
1. Loads FER2013 dataset
2. Preprocesses images (normalize, reshape)
3. Builds CNN model
4. Trains for 30 epochs (with early stopping)
5. Evaluates on test set
6. Saves model to `checkpoints/facial_emotion_model.h5`
7. Converts to TensorFlow.js format in `model/` directory

**Expected Training Time:**
- CPU: ~2-4 hours
- GPU: ~30-60 minutes

**Expected Results:**
- Test Accuracy: ~60-70%
- Model files: `model.json` + weight shards (~2-3 MB)

### Step 4: Copy Model to Public Directory

After training completes, copy the model files:

**Windows:**
```powershell
xcopy /E /I ml\model\* public\ml\model\
```

**Linux/Mac:**
```bash
cp -r ml/model/* public/ml/model/
```

**Verify files:**
- `public/ml/model/model.json`
- `public/ml/model/group1-shard1of*.bin` (one or more shard files)

### Step 5: Test the System

1. **Start Frontend:**
   ```bash
   npm run dev
   ```

2. **Navigate to:**
   ```
   http://localhost:8080/facial-emotion
   ```

3. **Test:**
   - Click "Start Camera"
   - Allow camera permissions
   - Make facial expressions
   - Watch real-time emotion detection!

## 📋 Checklist

- [ ] Install Python dependencies (`pip install -r requirements.txt`)
- [ ] Download FER2013 dataset to `ml/fer2013.csv`
- [ ] Train model (`python train_facial_emotion.py`)
- [ ] Copy model files to `public/ml/model/`
- [ ] Test facial emotion detection page
- [ ] Verify all 7 emotions are detected correctly

## 🔧 Troubleshooting

### "Model not found" Error
- Ensure `public/ml/model/model.json` exists
- Check browser console for loading errors
- Verify model files were copied correctly

### Training Errors
- **"fer2013.csv not found"**: Download dataset first
- **Out of memory**: Reduce batch size in `train_facial_emotion.py`
- **TensorFlow version issues**: Use TensorFlow 2.13+

### Camera Issues
- **Permission denied**: Check browser settings
- **No video**: Try different browser
- **HTTPS required**: Use HTTPS in production

### Performance Issues
- Model runs at ~10 FPS (optimized)
- Close other browser tabs
- Reduce FPS if needed (edit component)

## 🎯 Integration with Existing Features

The facial emotion detector can be integrated with:

1. **Text Emotion Detection** (already working)
   - Combine text + facial emotions for multi-modal analysis

2. **Chat Interface**
   - Add facial emotion context to chat messages
   - More accurate emotion understanding

3. **Dashboard**
   - Track facial emotions over time
   - Visualize emotion patterns

## 📊 Model Performance

After training, you'll see:
- Training/validation accuracy curves
- Confusion matrix visualization
- Classification report
- Model saved in multiple formats

## 🚀 Quick Start (After Setup)

Once everything is set up:

1. Open: `http://localhost:8080/facial-emotion`
2. Click "Start Camera"
3. Make expressions and see real-time detection!

The system is ready to use once the model is trained and deployed!

