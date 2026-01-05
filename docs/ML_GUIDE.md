# Emotion Classification Model

DistilBERT-based emotion classification model fine-tuned on the GoEmotions dataset.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Training

Train the model:
```bash
python train_model.py
```

The training script will:
- Load the GoEmotions dataset
- Split data into train/val/test (80/10/10)
- Fine-tune DistilBERT for 4-5 epochs
- Save the best model checkpoint with early stopping
- Evaluate on test set and report accuracy/F1-macro

Model checkpoints will be saved to `ml/checkpoints/best_model/`

## Inference

Test the model predictions:
```bash
python inference.py
```

## API Server

Start the FastAPI server:
```bash
python api_server.py
```

The API will be available at `http://localhost:8000`

### API Endpoints

- `GET /` - API status
- `GET /health` - Health check
- `POST /predict` - Get top-k emotion predictions
  ```json
  {
    "text": "I'm feeling great today!",
    "top_k": 3
  }
  ```
- `POST /predict/simple` - Get top emotion only
  ```json
  {
    "text": "I'm feeling great today!"
  }
  ```

## Model Architecture

- **Base Model**: distilbert-base-uncased
- **Output Layer**: Dense layer with softmax over 28 emotion classes
- **Loss**: CrossEntropyLoss
- **Optimizer**: AdamW (lr=2e-5)
- **Batch Size**: 16
- **Max Length**: 128 tokens

## Emotion Classes

The model classifies text into 28 emotion categories:
admiration, amusement, anger, annoyance, approval, caring, confusion, curiosity, desire, disappointment, disapproval, disgust, embarrassment, excitement, fear, gratitude, grief, joy, love, nervousness, optimism, pride, realization, relief, remorse, sadness, surprise, neutral
