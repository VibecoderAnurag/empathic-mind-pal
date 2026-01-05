# Facial Emotion Detection System

Complete facial emotion recognition system using TensorFlow.js for real-time webcam emotion detection.

## 🧠 Part 1: Model Training

### Prerequisites

1. **Download FER2013 Dataset**
   - Go to: https://www.kaggle.com/datasets/msambare/fer2013
   - Download `fer2013.csv`
   - Place it in the `ml/` directory

2. **Install Dependencies**
   ```bash
   cd ml
   pip install -r requirements.txt
   ```

### Training the Model

```bash
cd ml
python train_facial_emotion.py
```

**Training Process:**
- Loads FER2013 dataset (28,709 training images)
- Trains CNN for 30 epochs with early stopping
- Uses data augmentation (rotation, shifts, flips)
- Saves best model to `checkpoints/facial_emotion_model.h5`
- Converts to TensorFlow.js format in `model/` directory

**Expected Output:**
- Model accuracy: ~60-70% on test set
- TensorFlow.js files: `model.json` + weight shards

### Model Architecture

```
Conv2D(64) → BatchNorm → MaxPool
Conv2D(128) → BatchNorm → MaxPool → Dropout(0.25)
Flatten → Dense(256) → Dropout(0.5) → Dense(7)
```

## 💻 Part 2: Frontend Integration

### Setup

1. **Install TensorFlow.js**
   ```bash
   npm install @tensorflow/tfjs
   ```

2. **Copy Model Files**
   ```bash
   # After training, copy model files to public directory
   cp -r ml/model public/ml/model
   ```

   Or on Windows:
   ```powershell
   xcopy /E /I ml\model public\ml\model
   ```

### Usage

1. **Access the Component**
   - Navigate to: `http://localhost:8080/facial-emotion`
   - Or use the component in any page:
   ```tsx
   import { FacialEmotionDetector } from '@/components/FacialEmotionDetector';
   
   <FacialEmotionDetector 
     onEmotionDetected={(data) => {
       console.log(data.emotion, data.confidence);
     }}
   />
   ```

2. **Features**
   - Real-time webcam emotion detection
   - 7 emotion classes: angry, disgust, fear, happy, sad, surprise, neutral
   - Confidence scores and visual feedback
   - Smooth animations with Framer Motion
   - ~10 FPS performance optimized

### Component Props

```typescript
interface FacialEmotionDetectorProps {
  onEmotionDetected?: (data: { emotion: string; confidence: number }) => void;
}
```

## 📁 File Structure

```
project/
├── ml/
│   ├── train_facial_emotion.py    # Training script
│   ├── fer2013.csv                 # Dataset (download separately)
│   └── model/                      # TensorFlow.js model (after training)
│       ├── model.json
│       └── group1-shard*.bin
├── public/
│   └── ml/
│       └── model/                   # Copy from ml/model/
│           ├── model.json
│           └── group1-shard*.bin
└── src/
    ├── components/
    │   └── FacialEmotionDetector.tsx
    └── pages/
        └── FacialEmotion.tsx
```

## 🚀 Quick Start

1. **Train Model** (one-time setup):
   ```bash
   cd ml
   python train_facial_emotion.py
   ```

2. **Copy Model to Public**:
   ```bash
   cp -r ml/model public/ml/model
   ```

3. **Start Frontend**:
   ```bash
   npm run dev
   ```

4. **Test**:
   - Open: http://localhost:8080/facial-emotion
   - Click "Start Camera"
   - Make facial expressions!

## 🎯 Integration with MindEase

The facial emotion detector can be integrated with text and voice emotion detection for multi-modal emotion analysis:

```tsx
// Example: Fusion of text + facial emotions
const [textEmotion, setTextEmotion] = useState(null);
const [facialEmotion, setFacialEmotion] = useState(null);

// Combine both for comprehensive emotion analysis
const combinedEmotion = fuseEmotions(textEmotion, facialEmotion);
```

## ⚠️ Troubleshooting

### Model Not Found
- Ensure `public/ml/model/model.json` exists
- Check browser console for loading errors
- Verify model files are copied correctly

### Camera Permission Denied
- Check browser permissions
- Use HTTPS in production (required for camera access)
- Try different browser

### Low Performance
- Model runs at ~10 FPS for optimal performance
- Reduce to 5 FPS if needed: change `targetFPS` in component
- Close other browser tabs

### Training Issues
- Ensure FER2013.csv is in `ml/` directory
- Check TensorFlow version compatibility
- Reduce batch size if out of memory

## 📊 Performance

- **Model Size**: ~2-3 MB (TensorFlow.js)
- **Inference Time**: ~100ms per frame
- **FPS**: ~10 FPS (optimized)
- **Accuracy**: ~60-70% on FER2013 test set

## 🔧 Customization

### Change Detection Rate
Edit `FacialEmotionDetector.tsx`:
```typescript
const targetFPS = 15; // Increase for more frequent predictions
```

### Add More Emotions
1. Retrain model with additional emotion classes
2. Update `EMOTIONS` array in component
3. Add emoji mappings to `EMOTION_EMOJIS`

## 📝 Notes

- Model runs entirely in browser (no backend needed)
- Uses TensorFlow.js for client-side inference
- Optimized for performance and battery life
- Works best with good lighting and clear face visibility


