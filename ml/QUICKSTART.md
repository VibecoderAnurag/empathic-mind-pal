# Quick Start Guide

## Prerequisites

- Python 3.8 or higher
- pip package manager
- (Optional) CUDA-capable GPU for faster training

## Step 1: Setup Environment

### Windows:
```bash
setup.bat
```

### Linux/Mac:
```bash
bash setup.sh
```

### Manual Setup:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows
pip install -r requirements.txt
mkdir checkpoints
```

## Step 2: Train the Model

```bash
python train_model.py
```

**Expected Training Time:**
- CPU: ~2-4 hours (depending on hardware)
- GPU: ~30-60 minutes

The script will:
1. Download the GoEmotions dataset (~50MB)
2. Process and split the data (80/10/10)
3. Fine-tune DistilBERT for 4-5 epochs
4. Save the best model to `checkpoints/best_model/`

## Step 3: Test the Model

```bash
python inference.py
```

This will run example predictions to verify the model works.

## Step 4: Start the API Server

```bash
python api_server.py
```

The API will start at `http://localhost:8000`

## Step 5: Configure Frontend

1. Create a `.env` file in the project root:
   ```
   VITE_ML_API_URL=http://localhost:8000
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Model not found error
- Make sure you've trained the model first (Step 2)
- Check that `checkpoints/best_model/` exists

### API connection error
- Verify the API server is running on port 8000
- Check CORS settings in `api_server.py` if accessing from a different port

### Out of memory during training
- Reduce `batch_size` in `train_model.py` (e.g., from 16 to 8)
- Reduce `max_length` (e.g., from 128 to 64)

### Dataset download issues
- Check your internet connection
- The dataset is downloaded from Hugging Face Hub
- First download may take a few minutes

## Model Performance

After training, check `checkpoints/test_results.json` for:
- Test Accuracy
- Test F1-Macro Score

Expected performance:
- Accuracy: ~45-55% (28 classes is challenging)
- F1-Macro: ~0.40-0.50

## Next Steps

- Experiment with different hyperparameters
- Try different base models (BERT, RoBERTa)
- Fine-tune on your own emotion dataset
- Deploy the API to a cloud service

