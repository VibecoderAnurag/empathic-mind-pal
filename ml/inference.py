"""
Inference script for emotion classification model
"""

import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import json
import os
from typing import Dict, List, Tuple

class EmotionClassifier:
    """Emotion classification model for inference"""
    
    def __init__(self, model_path: str = "checkpoints/best_model"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Get absolute path to model directory (based on script location)
        script_dir = os.path.dirname(os.path.abspath(__file__))
        if os.path.isabs(model_path):
            self.model_path = model_path
        else:
            # Make relative path absolute based on script directory
            self.model_path = os.path.join(script_dir, model_path)
        
        # Normalize path
        self.model_path = os.path.normpath(self.model_path)
        
        # Load model and tokenizer
        print(f"Loading model from {self.model_path}...")
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model path does not exist: {self.model_path}")
        
        self.tokenizer = DistilBertTokenizer.from_pretrained(self.model_path)
        self.model = DistilBertForSequenceClassification.from_pretrained(self.model_path)
        self.model.to(self.device)
        self.model.eval()
        
        # Try to load label mappings from model config first
        if hasattr(self.model.config, 'id2label') and self.model.config.id2label:
            # Check if model config has proper emotion labels (not just LABEL_0, LABEL_1, etc.)
            config_labels = list(self.model.config.id2label.values())
            if config_labels and not all(label.startswith('LABEL_') for label in config_labels):
                # Model config has proper emotion labels
                print("Using label mappings from model config")
                self.id_to_label = {int(k): v for k, v in self.model.config.id2label.items()}
                print(f"Loaded {len(self.id_to_label)} label mappings from model config")
            else:
                # Model config has generic labels, try loading from file
                label_mapping_path = None
                label_mapping_paths = [
                    os.path.join(os.path.dirname(self.model_path), "label_mappings.json"),
                    os.path.join(script_dir, "checkpoints", "label_mappings.json"),
                    os.path.join(script_dir, "label_mappings.json"),
                ]
                
                for path in label_mapping_paths:
                    if os.path.exists(path):
                        label_mapping_path = path
                        break
                
                if label_mapping_path and os.path.exists(label_mapping_path):
                    print(f"Loading label mappings from {label_mapping_path}")
                    with open(label_mapping_path, "r") as f:
                        mappings = json.load(f)
                        self.id_to_label = {int(k): v for k, v in mappings["id_to_label"].items()}
                    print(f"Loaded {len(self.id_to_label)} label mappings from file")
                else:
                    # Fallback to default GoEmotions labels
                    print("Warning: label_mappings.json not found, using default labels")
                    self.id_to_label = {i: label for i, label in enumerate([
                        "admiration", "amusement", "anger", "annoyance", "approval", "caring",
                        "confusion", "curiosity", "desire", "disappointment", "disapproval",
                        "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief",
                        "joy", "love", "nervousness", "optimism", "pride", "realization",
                        "relief", "remorse", "sadness", "surprise", "neutral"
                    ])}
        else:
            # Model config doesn't have id2label, try loading from file
            label_mapping_path = None
            label_mapping_paths = [
                os.path.join(os.path.dirname(self.model_path), "label_mappings.json"),
                os.path.join(script_dir, "checkpoints", "label_mappings.json"),
                os.path.join(script_dir, "label_mappings.json"),
            ]
            
            for path in label_mapping_paths:
                if os.path.exists(path):
                    label_mapping_path = path
                    break
            
            if label_mapping_path and os.path.exists(label_mapping_path):
                print(f"Loading label mappings from {label_mapping_path}")
                with open(label_mapping_path, "r") as f:
                    mappings = json.load(f)
                    self.id_to_label = {int(k): v for k, v in mappings["id_to_label"].items()}
                print(f"Loaded {len(self.id_to_label)} label mappings from file")
            else:
                # Fallback to default GoEmotions labels
                print("Warning: label_mappings.json not found and model config has no labels, using default labels")
                self.id_to_label = {i: label for i, label in enumerate([
                    "admiration", "amusement", "anger", "annoyance", "approval", "caring",
                    "confusion", "curiosity", "desire", "disappointment", "disapproval",
                    "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief",
                    "joy", "love", "nervousness", "optimism", "pride", "realization",
                    "relief", "remorse", "sadness", "surprise", "neutral"
                ])}
        
        print(f"Model loaded successfully. Device: {self.device}")
        print(f"Number of emotion classes: {len(self.id_to_label)}")
    
    def predict(self, text: str, top_k: int = 3) -> List[Dict[str, float]]:
        """
        Predict emotions for a given text
        
        Args:
            text: Input text to classify
            top_k: Number of top emotions to return
            
        Returns:
            List of dictionaries with 'emotion' and 'confidence' keys
        """
        # Tokenize input
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding="max_length",
            max_length=128,
            return_tensors="pt"
        )
        
        input_ids = encoding["input_ids"].to(self.device)
        attention_mask = encoding["attention_mask"].to(self.device)
        
        # Get predictions
        with torch.no_grad():
            outputs = self.model(input_ids=input_ids, attention_mask=attention_mask)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)
        
        # Get top-k predictions
        probs = probabilities[0].cpu().numpy()
        top_indices = probs.argsort()[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            emotion = self.id_to_label.get(idx, f"emotion_{idx}")
            confidence = float(probs[idx])
            results.append({
                "emotion": emotion,
                "confidence": confidence
            })
        
        return results
    
    def predict_single(self, text: str) -> Tuple[str, float]:
        """
        Predict the top emotion for a given text
        
        Args:
            text: Input text to classify
            
        Returns:
            Tuple of (emotion, confidence)
        """
        predictions = self.predict(text, top_k=1)
        return predictions[0]["emotion"], predictions[0]["confidence"]

def main():
    """Example usage"""
    classifier = EmotionClassifier()
    
    # Test examples
    test_texts = [
        "I'm so happy today! Everything is going great!",
        "I feel really anxious about the upcoming exam.",
        "That movie made me so angry, it was terrible.",
        "I'm grateful for all the support I've received."
    ]
    
    print("\n=== Emotion Classification Results ===\n")
    for text in test_texts:
        predictions = classifier.predict(text, top_k=3)
        print(f"Text: {text}")
        print("Top emotions:")
        for pred in predictions:
            print(f"  - {pred['emotion']}: {pred['confidence']:.4f}")
        print()

if __name__ == "__main__":
    main()

