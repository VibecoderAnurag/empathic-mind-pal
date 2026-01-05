# Fix for Text Sentiment Model Always Returning "Neutral"

## Problem
The text sentiment model was always returning "neutral" for every input.

## Root Cause
The issue was likely caused by one or more of the following:
1. **API Server Not Running**: The ML API server must be running for the model to work
2. **Path Resolution Issues**: The model wasn't loading correctly when the API server was run from different directories
3. **Model Loading Errors**: Errors during model loading were silently causing fallback to neutral responses

## Fixes Applied

### 1. Fixed Path Resolution in `inference.py`
- Updated to use absolute paths based on script location
- Added multiple fallback locations for `label_mappings.json`
- Improved error handling and logging

### 2. Improved API Server Error Handling (`api_server.py`)
- Added better error logging and debugging
- Added test prediction on startup to verify model is working
- Improved path resolution for model loading

### 3. Enhanced Label Mapping Loading
- Model now tries to use labels from model config first
- Falls back to `label_mappings.json` file if needed
- Better error messages when labels can't be found

### 4. Fixed Training Script (`train_model.py`)
- Model config now properly includes label mappings during training
- This ensures the saved model has correct emotion labels

### 5. Fixed Frontend Bug
- Fixed bug in `Chat.tsx` where `fallbackEmotionDisplay` was undefined
- Improved error logging in `mlEmotionApi.ts`

## How to Fix Your Issue

### Step 1: Start the API Server
1. Open a terminal/command prompt
2. Navigate to the `ml` directory:
   ```bash
   cd "capstone project/empathic-mind-pal/ml"
   ```
3. Start the API server:
   ```bash
   python api_server.py
   ```
4. You should see output like:
   ```
   Attempting to load model from: C:\Users\...\ml\checkpoints\best_model
   Loading model from ...
   Loading label mappings from ...
   Model loaded successfully!
   Model test prediction: [{'emotion': 'joy', 'confidence': 0.8265...}]
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

### Step 2: Verify API Server is Running
1. Open your browser and go to: `http://localhost:8000/health`
2. You should see: `{"status": "healthy", "model_loaded": true}`
3. If `model_loaded` is `false`, check the API server console for errors

### Step 3: Test the Model
1. Test the model directly:
   ```bash
   cd "capstone project/empathic-mind-pal/ml"
   python -c "from inference import EmotionClassifier; classifier = EmotionClassifier('checkpoints/best_model'); result = classifier.predict('I am so happy today!'); print(result)"
   ```
2. You should see predictions like:
   ```
   [{'emotion': 'joy', 'confidence': 0.8265...}, ...]
   ```

### Step 4: Start Your Frontend
1. In a new terminal, navigate to the project root:
   ```bash
   cd "capstone project/empathic-mind-pal"
   ```
2. Start the frontend:
   ```bash
   npm run dev
   ```
3. The frontend should now connect to the API server

## Troubleshooting

### If the API Server Fails to Load the Model
1. Check that the model exists at `ml/checkpoints/best_model/`
2. Check that `ml/checkpoints/label_mappings.json` exists
3. Check the API server console for error messages
4. Verify you have all required dependencies installed:
   ```bash
   cd ml
   pip install -r requirements.txt
   ```

### If the Model Always Returns Neutral
1. **Check if the API server is running**: Look for the API server process
2. **Check browser console**: Look for errors about API calls failing
3. **Check API server logs**: Look for errors about model loading or predictions
4. **Verify model was trained**: The model should be trained before use
   ```bash
   cd ml
   python train_model.py
   ```

### If the Frontend Falls Back to Keyword Analysis
- This means the ML API is not available
- Check that the API server is running on port 8000
- Check that `VITE_ML_API_URL` environment variable is set correctly (defaults to `http://localhost:8000`)
- Check browser console for CORS errors or connection errors

## Expected Behavior

When working correctly:
- Input: "I am so happy today!"
- Output: `joy` with high confidence (e.g., 0.82)

- Input: "I feel terrible and sad"
- Output: `sadness` with high confidence (e.g., 0.73)

- Input: "I am anxious about the exam"
- Output: `anxiety` or `nervousness` with high confidence

## Testing the Fix

1. Start the API server (see Step 1 above)
2. Test with different inputs:
   - Happy: "I'm so excited and happy!"
   - Sad: "I feel terrible and depressed"
   - Angry: "I'm so frustrated and angry"
   - Anxious: "I'm really worried and anxious"
3. Verify that different emotions are predicted, not always "neutral"

## Notes

- The model requires the API server to be running
- If the API server is not running, the frontend will fall back to keyword-based analysis
- Keyword-based analysis has limited accuracy and may return "neutral" if keywords don't match
- The ML model supports 28 different emotions (admiration, amusement, anger, etc.)
- The model was trained on the GoEmotions dataset

