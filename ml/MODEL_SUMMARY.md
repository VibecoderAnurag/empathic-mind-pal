# Emotion Classification Model Summary

## Model Architecture

- **Base Model**: `distilbert-base-uncased` (Hugging Face)
- **Task**: Multi-class emotion classification
- **Classes**: 28 emotions from GoEmotions dataset
- **Output**: Softmax probabilities over emotion classes

## Training Configuration

- **Optimizer**: AdamW
- **Learning Rate**: 2e-5
- **Loss Function**: CrossEntropyLoss
- **Batch Size**: 16
- **Max Sequence Length**: 128 tokens
- **Epochs**: 5 (with early stopping)
- **Early Stopping Patience**: 3 epochs
- **Warmup Steps**: 100
- **Train/Val/Test Split**: 80/10/10

## Dataset

- **Source**: GoEmotions (simplified version)
- **Size**: ~58,000 training examples
- **Labels**: 28 emotion categories
- **Format**: Reddit comments labeled with emotions

## Model Output

The model returns:
- Top emotion prediction (string)
- Confidence score (0-1)
- Optionally top-k predictions with confidence scores

## Integration

The model is integrated into the frontend through:
1. **FastAPI Backend** (`api_server.py`) - Serves predictions via REST API
2. **Frontend API Client** (`src/utils/mlEmotionApi.ts`) - Calls the ML API
3. **Chat Component** (`src/pages/Chat.tsx`) - Uses ML predictions for emotion analysis

## Emotion Mapping

GoEmotions labels are mapped to app emotions:
- **Happy**: joy, amusement, optimism, love, gratitude, pride, etc.
- **Sad**: sadness, grief, disappointment, remorse
- **Angry**: anger, annoyance, disapproval, disgust
- **Anxious**: fear, nervousness, embarrassment
- **Excited**: excitement
- **Neutral**: neutral, curiosity, confusion, etc.

## Files Structure

```
ml/
├── train_model.py      # Training script
├── inference.py        # Inference class and script
├── api_server.py       # FastAPI server
├── requirements.txt    # Python dependencies
├── setup.sh           # Linux/Mac setup script
├── setup.bat          # Windows setup script
├── README.md          # Detailed documentation
├── QUICKSTART.md      # Quick start guide
└── checkpoints/       # Model checkpoints (created after training)
    ├── best_model/    # Best model checkpoint
    ├── label_mappings.json
    ├── training_history.json
    └── test_results.json
```

## Performance Metrics

After training, the model will be evaluated on:
- **Accuracy**: Overall classification accuracy
- **F1-Macro**: Macro-averaged F1 score across all classes

Results are saved to `checkpoints/test_results.json`.

## Usage

### Training
```bash
python train_model.py
```

### Inference
```bash
python inference.py
```

### API Server
```bash
python api_server.py
```

### Frontend Integration
The frontend automatically uses the ML model when the API is available, with fallback to keyword-based analysis.

