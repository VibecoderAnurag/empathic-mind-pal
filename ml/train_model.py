"""
DistilBERT-based emotion classification model training script
Fine-tuned on GoEmotions dataset
"""

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from transformers import (
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    get_linear_schedule_with_warmup
)
from torch.optim import AdamW
from datasets import load_dataset
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
import numpy as np
import os
from tqdm import tqdm
import json
from typing import Dict, List, Tuple

# Configuration
CONFIG = {
    "model_name": "distilbert-base-uncased",
    "num_emotions": 28,
    "max_length": 128,
    "batch_size": 16,
    "learning_rate": 2e-5,
    "epochs": 5,
    "warmup_steps": 100,
    "save_dir": "checkpoints",  # Relative to ml/ directory
    "patience": 3,  # Early stopping patience
}

# GoEmotions emotion labels (simplified version has 28 emotions)
EMOTION_LABELS = [
    "admiration", "amusement", "anger", "annoyance", "approval", "caring",
    "confusion", "curiosity", "desire", "disappointment", "disapproval",
    "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief",
    "joy", "love", "nervousness", "optimism", "pride", "realization",
    "relief", "remorse", "sadness", "surprise", "neutral"
]

class EmotionDataset(Dataset):
    """Dataset class for emotion classification"""
    
    def __init__(self, texts: List[str], labels: List[int], tokenizer, max_length: int = 128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]
        
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding="max_length",
            max_length=self.max_length,
            return_tensors="pt"
        )
        
        return {
            "input_ids": encoding["input_ids"].flatten(),
            "attention_mask": encoding["attention_mask"].flatten(),
            "labels": torch.tensor(label, dtype=torch.long)
        }

def load_and_prepare_data():
    """Load GoEmotions dataset and prepare it for training"""
    print("Loading GoEmotions dataset...")
    ds = load_dataset("google-research-datasets/go_emotions", "simplified")
    
    # Get emotion label names from dataset features
    emotion_labels = ds["train"].features["labels"].feature.names
    
    # Extract texts and labels
    texts = []
    label_ids = []
    
    # Process train split
    for example in ds["train"]:
        text = example["text"]
        # Get the primary emotion (first label)
        labels = example["labels"]
        if len(labels) > 0:
            # Labels are already numeric indices in the simplified version
            primary_label = labels[0]
            label_ids.append(primary_label)
            texts.append(text)
    
    print(f"Loaded {len(texts)} examples from training set")
    print(f"Found {len(emotion_labels)} emotion classes")
    print(f"Emotion classes: {emotion_labels}")
    
    # Create label mappings (labels are already 0-indexed)
    label_to_id = {emotion_labels[i]: i for i in range(len(emotion_labels))}
    id_to_label = {i: emotion_labels[i] for i in range(len(emotion_labels))}
    
    # Split data: 80% train, 10% val, 10% test
    # Note: We need to handle stratification carefully with imbalanced data
    try:
        X_train, X_temp, y_train, y_temp = train_test_split(
            texts, label_ids, test_size=0.2, random_state=42, stratify=label_ids
        )
        
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
        )
    except ValueError as e:
        # If stratification fails due to class imbalance, use shuffle instead
        print(f"Warning: Stratification failed: {e}. Using shuffle split instead.")
        X_train, X_temp, y_train, y_temp = train_test_split(
            texts, label_ids, test_size=0.2, random_state=42, shuffle=True
        )
        
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.5, random_state=42, shuffle=True
        )
    
    print(f"Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")
    
    return (X_train, y_train), (X_val, y_val), (X_test, y_test), label_to_id, id_to_label

def train_epoch(model, dataloader, optimizer, scheduler, device):
    """Train for one epoch"""
    model.train()
    total_loss = 0
    
    progress_bar = tqdm(dataloader, desc="Training")
    for batch in progress_bar:
        optimizer.zero_grad()
        
        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        labels = batch["labels"].to(device)
        
        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            labels=labels
        )
        
        loss = outputs.loss
        total_loss += loss.item()
        
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        scheduler.step()
        
        progress_bar.set_postfix({"loss": loss.item()})
    
    return total_loss / len(dataloader)

def evaluate(model, dataloader, device):
    """Evaluate the model"""
    model.eval()
    predictions = []
    true_labels = []
    total_loss = 0
    
    with torch.no_grad():
        for batch in tqdm(dataloader, desc="Evaluating"):
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)
            
            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
                labels=labels
            )
            
            loss = outputs.loss
            total_loss += loss.item()
            
            logits = outputs.logits
            preds = torch.argmax(logits, dim=1)
            
            predictions.extend(preds.cpu().numpy())
            true_labels.extend(labels.cpu().numpy())
    
    accuracy = accuracy_score(true_labels, predictions)
    f1_macro = f1_score(true_labels, predictions, average="macro")
    avg_loss = total_loss / len(dataloader)
    
    return accuracy, f1_macro, avg_loss

def train():
    """Main training function"""
    # Set device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    # Create save directory
    os.makedirs(CONFIG["save_dir"], exist_ok=True)
    
    # Load and prepare data
    (X_train, y_train), (X_val, y_val), (X_test, y_test), label_to_id, id_to_label = load_and_prepare_data()
    
    # Save label mappings
    with open(os.path.join(CONFIG["save_dir"], "label_mappings.json"), "w") as f:
        json.dump({
            "label_to_id": label_to_id,
            "id_to_label": {str(k): v for k, v in id_to_label.items()}
        }, f, indent=2)
    
    num_emotions = len(label_to_id)
    CONFIG["num_emotions"] = num_emotions
    print(f"Model will predict {num_emotions} emotion classes")
    
    # Initialize tokenizer and model
    print("Initializing tokenizer and model...")
    tokenizer = DistilBertTokenizer.from_pretrained(CONFIG["model_name"])
    
    # Create label mappings for model config
    id2label = {str(i): label for i, label in id_to_label.items()}
    label2id = {label: i for i, label in id_to_label.items()}
    
    model = DistilBertForSequenceClassification.from_pretrained(
        CONFIG["model_name"],
        num_labels=CONFIG["num_emotions"],
        id2label=id2label,
        label2id=label2id
    )
    model.to(device)
    
    # Create datasets and dataloaders
    train_dataset = EmotionDataset(X_train, y_train, tokenizer, CONFIG["max_length"])
    val_dataset = EmotionDataset(X_val, y_val, tokenizer, CONFIG["max_length"])
    test_dataset = EmotionDataset(X_test, y_test, tokenizer, CONFIG["max_length"])
    
    train_loader = DataLoader(train_dataset, batch_size=CONFIG["batch_size"], shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=CONFIG["batch_size"], shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=CONFIG["batch_size"], shuffle=False)
    
    # Initialize optimizer and scheduler
    optimizer = AdamW(model.parameters(), lr=CONFIG["learning_rate"])
    total_steps = len(train_loader) * CONFIG["epochs"]
    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=CONFIG["warmup_steps"],
        num_training_steps=total_steps
    )
    
    # Training loop with early stopping
    best_val_f1 = 0
    patience_counter = 0
    training_history = []
    
    print("\nStarting training...")
    for epoch in range(CONFIG["epochs"]):
        print(f"\nEpoch {epoch + 1}/{CONFIG['epochs']}")
        
        # Train
        train_loss = train_epoch(model, train_loader, optimizer, scheduler, device)
        
        # Validate
        val_accuracy, val_f1, val_loss = evaluate(model, val_loader, device)
        
        print(f"Train Loss: {train_loss:.4f}")
        print(f"Val Loss: {val_loss:.4f}")
        print(f"Val Accuracy: {val_accuracy:.4f}")
        print(f"Val F1-Macro: {val_f1:.4f}")
        
        training_history.append({
            "epoch": epoch + 1,
            "train_loss": train_loss,
            "val_loss": val_loss,
            "val_accuracy": val_accuracy,
            "val_f1": val_f1
        })
        
        # Save best model
        if val_f1 > best_val_f1:
            best_val_f1 = val_f1
            patience_counter = 0
            print(f"New best F1 score: {val_f1:.4f}. Saving model...")
            
            model.save_pretrained(os.path.join(CONFIG["save_dir"], "best_model"))
            tokenizer.save_pretrained(os.path.join(CONFIG["save_dir"], "best_model"))
        else:
            patience_counter += 1
            print(f"No improvement. Patience: {patience_counter}/{CONFIG["patience"]}")
        
        # Early stopping
        if patience_counter >= CONFIG["patience"]:
            print(f"Early stopping triggered after {epoch + 1} epochs")
            break
    
    # Save training history
    with open(os.path.join(CONFIG["save_dir"], "training_history.json"), "w") as f:
        json.dump(training_history, f, indent=2)
    
    # Load best model and evaluate on test set
    print("\nLoading best model for test evaluation...")
    model = DistilBertForSequenceClassification.from_pretrained(
        os.path.join(CONFIG["save_dir"], "best_model")
    )
    model.to(device)
    
    test_accuracy, test_f1, test_loss = evaluate(model, test_loader, device)
    
    print(f"\n=== Final Test Results ===")
    print(f"Test Loss: {test_loss:.4f}")
    print(f"Test Accuracy: {test_accuracy:.4f}")
    print(f"Test F1-Macro: {test_f1:.4f}")
    
    # Save test results
    with open(os.path.join(CONFIG["save_dir"], "test_results.json"), "w") as f:
        json.dump({
            "test_loss": test_loss,
            "test_accuracy": test_accuracy,
            "test_f1_macro": test_f1
        }, f, indent=2)
    
    print(f"\nModel saved to: {CONFIG["save_dir"]}/best_model")
    print("Training completed!")

if __name__ == "__main__":
    train()

