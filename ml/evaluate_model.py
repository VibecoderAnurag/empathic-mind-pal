"""
Evaluate the saved model on the test set
"""

import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from torch.utils.data import DataLoader
from datasets import load_dataset
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
import json
import os
from tqdm import tqdm
from train_model import EmotionDataset

def load_and_prepare_test_data():
    """Load GoEmotions dataset and prepare test set"""
    print("Loading GoEmotions dataset...")
    ds = load_dataset("google-research-datasets/go_emotions", "simplified")
    
    # Get emotion label names from dataset features
    emotion_labels = ds["train"].features["labels"].feature.names
    
    # Extract texts and labels from train split (to match training)
    texts = []
    label_ids = []
    
    for example in ds["train"]:
        text = example["text"]
        labels = example["labels"]
        if len(labels) > 0:
            primary_label = labels[0]
            label_ids.append(primary_label)
            texts.append(text)
    
    # Split data the same way as training (80/10/10)
    try:
        X_train, X_temp, y_train, y_temp = train_test_split(
            texts, label_ids, test_size=0.2, random_state=42, stratify=label_ids
        )
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
        )
    except ValueError:
        X_train, X_temp, y_train, y_temp = train_test_split(
            texts, label_ids, test_size=0.2, random_state=42, shuffle=True
        )
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.5, random_state=42, shuffle=True
        )
    
    # Create label mappings
    label_to_id = {emotion_labels[i]: i for i in range(len(emotion_labels))}
    id_to_label = {i: emotion_labels[i] for i in range(len(emotion_labels))}
    
    return X_test, y_test, label_to_id, id_to_label

def evaluate(model, dataloader, device):
    """Evaluate the model"""
    model.eval()
    predictions = []
    true_labels = []
    total_loss = 0
    
    criterion = torch.nn.CrossEntropyLoss()
    
    with torch.no_grad():
        for batch in tqdm(dataloader, desc="Evaluating"):
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)
            
            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask
            )
            
            logits = outputs.logits
            loss = criterion(logits, labels)
            total_loss += loss.item()
            
            preds = torch.argmax(logits, dim=1)
            
            predictions.extend(preds.cpu().numpy())
            true_labels.extend(labels.cpu().numpy())
    
    accuracy = accuracy_score(true_labels, predictions)
    f1_macro = f1_score(true_labels, predictions, average="macro")
    avg_loss = total_loss / len(dataloader)
    
    return accuracy, f1_macro, avg_loss

def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    model_path = "checkpoints/best_model"
    
    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}")
        print("Please train the model first using: python train_model.py")
        return
    
    # Load test data
    X_test, y_test, label_to_id, id_to_label = load_and_prepare_test_data()
    
    # Initialize tokenizer and model
    print("Loading model...")
    tokenizer = DistilBertTokenizer.from_pretrained(model_path)
    model = DistilBertForSequenceClassification.from_pretrained(model_path)
    model.to(device)
    
    # Create test dataset and dataloader
    test_dataset = EmotionDataset(X_test, y_test, tokenizer, max_length=128)
    test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False)
    
    print(f"Evaluating on {len(X_test)} test examples...")
    test_accuracy, test_f1, test_loss = evaluate(model, test_loader, device)
    
    print(f"\n=== Test Results ===")
    print(f"Test Loss: {test_loss:.4f}")
    print(f"Test Accuracy: {test_accuracy:.4f}")
    print(f"Test F1-Macro: {test_f1:.4f}")
    
    # Save test results
    results = {
        "test_loss": float(test_loss),
        "test_accuracy": float(test_accuracy),
        "test_f1_macro": float(test_f1)
    }
    
    with open("checkpoints/test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\nResults saved to checkpoints/test_results.json")

if __name__ == "__main__":
    main()

