"""
Facial Emotion Recognition Model Training
Uses FER2013 dataset to train a CNN for 7 emotion classification
"""

import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models, callbacks
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report
import os

# Try to import psutil for memory detection (optional)
try:
    import psutil
except ImportError:
    psutil = None

# Configuration
CONFIG = {
    "img_size": 48,
    "batch_size": 32,  # Reduced from 64 for better memory efficiency
    "epochs": 30,
    "patience": 5,
    "learning_rate": 0.001,
    "validation_split": 0.2,
    "model_save_path": "checkpoints/facial_emotion_model.h5",
    "tfjs_output_dir": "model",
}

# Auto-detect and adjust batch size based on available memory
try:
    import psutil
    available_memory_gb = psutil.virtual_memory().available / (1024 ** 3)
    if available_memory_gb < 2:
        CONFIG["batch_size"] = 16
        print(f"[INFO] Low memory detected ({available_memory_gb:.1f} GB). Using batch size: {CONFIG['batch_size']}")
    elif available_memory_gb < 4:
        CONFIG["batch_size"] = 32
        print(f"[INFO] Moderate memory ({available_memory_gb:.1f} GB). Using batch size: {CONFIG['batch_size']}")
    else:
        CONFIG["batch_size"] = 64
        print(f"[INFO] Sufficient memory ({available_memory_gb:.1f} GB). Using batch size: {CONFIG['batch_size']}")
except (ImportError, Exception):
    # psutil not available or error, use default batch size
    print(f"[INFO] Using default batch size: {CONFIG['batch_size']}")
    pass

# Emotion labels (7 classes)
EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
NUM_CLASSES = len(EMOTIONS)

def load_fer2013_data(data_dir='FER2013'):
    """
    Load FER2013 dataset from image directories
    Structure: FER2013/train/{emotion}/*.jpg and FER2013/test/{emotion}/*.jpg
    """
    print("Loading FER2013 dataset from image directories...")
    
    # Check if directory exists
    if not os.path.exists(data_dir):
        print(f"ERROR: {data_dir} directory not found!")
        print("\nPlease ensure FER2013 dataset is in the ml/ directory")
        print("Structure should be:")
        print("  FER2013/train/{emotion}/*.jpg")
        print("  FER2013/test/{emotion}/*.jpg")
        return None, None, None
    
    train_dir = os.path.join(data_dir, 'train')
    test_dir = os.path.join(data_dir, 'test')
    
    if not os.path.exists(train_dir) or not os.path.exists(test_dir):
        print(f"ERROR: {train_dir} or {test_dir} not found!")
        return None, None, None
    
    # Emotion to index mapping
    emotion_to_idx = {emotion: idx for idx, emotion in enumerate(EMOTIONS)}
    
    def load_images_from_dir(directory, emotion_label):
        """Load images from a directory and assign emotion label"""
        images = []
        labels = []
        emotion_path = os.path.join(directory, emotion_label)
        
        if not os.path.exists(emotion_path):
            return images, labels
        
        image_files = [f for f in os.listdir(emotion_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        for img_file in image_files:
            try:
                img_path = os.path.join(emotion_path, img_file)
                # Load and preprocess image
                img = keras.preprocessing.image.load_img(img_path, color_mode='grayscale', target_size=(48, 48))
                img_array = keras.preprocessing.image.img_to_array(img)
                images.append(img_array)
                labels.append(emotion_to_idx[emotion_label])
            except Exception as e:
                print(f"Warning: Could not load {img_path}: {e}")
                continue
        
        return images, labels
    
    print("Loading training images...")
    X_train = []
    y_train = []
    
    for emotion in EMOTIONS:
        imgs, lbls = load_images_from_dir(train_dir, emotion)
        X_train.extend(imgs)
        y_train.extend(lbls)
        print(f"  Loaded {len(imgs)} {emotion} images")
    
    print("Loading test images...")
    X_test = []
    y_test = []
    
    for emotion in EMOTIONS:
        imgs, lbls = load_images_from_dir(test_dir, emotion)
        X_test.extend(imgs)
        y_test.extend(lbls)
        print(f"  Loaded {len(imgs)} {emotion} images")
    
    # Convert to numpy arrays
    X_train = np.array(X_train, dtype='float32')
    X_test = np.array(X_test, dtype='float32')
    y_train = np.array(y_train, dtype='int32')
    y_test = np.array(y_test, dtype='int32')
    
    # Normalize pixel values to [0, 1]
    X_train = X_train / 255.0
    X_test = X_test / 255.0
    
    # Reshape if needed (should already be 48x48x1)
    if len(X_train.shape) == 3:
        X_train = X_train.reshape(-1, 48, 48, 1)
    if len(X_test.shape) == 3:
        X_test = X_test.reshape(-1, 48, 48, 1)
    
    # Split training into train/validation (80/20)
    from sklearn.model_selection import train_test_split
    X_train, X_val, y_train, y_val = train_test_split(
        X_train, y_train, test_size=0.2, random_state=42, stratify=y_train
    )
    
    # Convert labels to one-hot encoding
    y_train_one_hot = keras.utils.to_categorical(y_train, NUM_CLASSES)
    y_val_one_hot = keras.utils.to_categorical(y_val, NUM_CLASSES)
    y_test_one_hot = keras.utils.to_categorical(y_test, NUM_CLASSES)
    
    print(f"\nDataset loaded successfully!")
    print(f"Training samples: {len(X_train):,}")
    print(f"Validation samples: {len(X_val):,}")
    print(f"Test samples: {len(X_test):,}")
    print(f"Image shape: {X_train[0].shape}")
    
    return (X_train, y_train_one_hot, y_train), (X_val, y_val_one_hot, y_val), (X_test, y_test_one_hot, y_test)

def build_model():
    """Build CNN model for facial emotion recognition"""
    print("\nBuilding CNN model...")
    
    model = models.Sequential([
        # First Conv Block
        layers.Conv2D(64, (3, 3), activation='relu', input_shape=(48, 48, 1)),
        layers.BatchNormalization(),
        layers.MaxPooling2D(2, 2),
        
        # Second Conv Block
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D(2, 2),
        layers.Dropout(0.25),
        
        # Flatten and Dense layers
        layers.Flatten(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(NUM_CLASSES, activation='softmax')
    ])
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=CONFIG["learning_rate"]),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print(model.summary())
    return model

def train_model(model, X_train, y_train, X_val, y_val):
    """Train the model with callbacks"""
    print("\nStarting training...")
    
    # Create callbacks
    callbacks_list = [
        callbacks.EarlyStopping(
            monitor='val_loss',
            patience=CONFIG["patience"],
            restore_best_weights=True,
            verbose=1
        ),
        callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=0.00001,
            verbose=1
        ),
        callbacks.ModelCheckpoint(
            CONFIG["model_save_path"],
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        )
    ]
    
    # Data augmentation
    datagen = keras.preprocessing.image.ImageDataGenerator(
        rotation_range=10,
        width_shift_range=0.1,
        height_shift_range=0.1,
        horizontal_flip=True,
        zoom_range=0.1
    )
    
    history = model.fit(
        datagen.flow(X_train, y_train, batch_size=CONFIG["batch_size"]),
        steps_per_epoch=len(X_train) // CONFIG["batch_size"],
        epochs=CONFIG["epochs"],
        validation_data=(X_val, y_val),
        callbacks=callbacks_list,
        verbose=1
    )
    
    return history

def evaluate_model(model, X_test, y_test, y_test_labels):
    """Evaluate model and print metrics"""
    print("\nEvaluating model on test set...")
    
    # Predictions
    y_pred = model.predict(X_test)
    y_pred_labels = np.argmax(y_pred, axis=1)
    
    # Accuracy
    test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
    print(f"\nTest Accuracy: {test_accuracy:.4f}")
    print(f"Test Loss: {test_loss:.4f}")
    
    # Classification report
    print("\nClassification Report:")
    print(classification_report(y_test_labels, y_pred_labels, target_names=EMOTIONS))
    
    # Confusion matrix
    cm = confusion_matrix(y_test_labels, y_pred_labels)
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=EMOTIONS, yticklabels=EMOTIONS)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig('checkpoints/confusion_matrix.png')
    print("\nConfusion matrix saved to checkpoints/confusion_matrix.png")
    
    return test_accuracy, cm

def convert_to_tfjs():
    """Convert Keras model to TensorFlow.js format"""
    print("\nConverting model to TensorFlow.js format...")
    
    try:
        # Suppress numpy warnings for tensorflowjs compatibility
        import warnings
        warnings.filterwarnings('ignore', category=FutureWarning)
        import tensorflowjs as tfjs
    except ImportError:
        print("ERROR: tensorflowjs not installed!")
        print("Install with: pip install tensorflowjs")
        return False
    except Exception as e:
        print(f"WARNING: Could not import tensorflowjs: {e}")
        print("Trying alternative conversion method...")
        try:
            # Try using command line conversion instead
            import subprocess
            import sys
            result = subprocess.run(
                [sys.executable, "-m", "tensorflowjs.converters", "keras_to_tfjs",
                 CONFIG["model_save_path"], CONFIG["tfjs_output_dir"]],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                print("✅ Model converted using command line method!")
                return True
            else:
                print(f"Conversion failed: {result.stderr}")
                return False
        except Exception as e2:
            print(f"ERROR: Could not convert model: {e2}")
            print("You can manually convert later using:")
            print(f"  tensorflowjs_converter --input_format keras {CONFIG['model_save_path']} {CONFIG['tfjs_output_dir']}")
            return False
    
    # Create output directory
    os.makedirs(CONFIG["tfjs_output_dir"], exist_ok=True)
    
    # Convert model
    tfjs.converters.save_keras_model(
        keras.models.load_model(CONFIG["model_save_path"]),
        CONFIG["tfjs_output_dir"]
    )
    
    print(f"✅ Model converted successfully!")
    print(f"TensorFlow.js files saved to: {CONFIG['tfjs_output_dir']}/")
    print(f"Files: model.json + weight shards")
    
    return True

def plot_training_history(history):
    """Plot training history"""
    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    
    # Accuracy
    axes[0].plot(history.history['accuracy'], label='Train Accuracy')
    axes[0].plot(history.history['val_accuracy'], label='Val Accuracy')
    axes[0].set_title('Model Accuracy')
    axes[0].set_xlabel('Epoch')
    axes[0].set_ylabel('Accuracy')
    axes[0].legend()
    axes[0].grid(True)
    
    # Loss
    axes[1].plot(history.history['loss'], label='Train Loss')
    axes[1].plot(history.history['val_loss'], label='Val Loss')
    axes[1].set_title('Model Loss')
    axes[1].set_xlabel('Epoch')
    axes[1].set_ylabel('Loss')
    axes[1].legend()
    axes[1].grid(True)
    
    plt.tight_layout()
    plt.savefig('checkpoints/training_history.png')
    print("Training history saved to checkpoints/training_history.png")

def main():
    """Main training pipeline"""
    print("=" * 60)
    print("Facial Emotion Recognition Model Training")
    print("=" * 60)
    
    # Create checkpoints directory
    os.makedirs("checkpoints", exist_ok=True)
    
    # Load data
    train_data, val_data, test_data = load_fer2013_data()
    
    if train_data is None:
        return
    
    X_train, y_train, y_train_labels = train_data
    X_val, y_val, y_val_labels = val_data
    X_test, y_test, y_test_labels = test_data
    
    # Build model
    model = build_model()
    
    # Train model
    history = train_model(model, X_train, y_train, X_val, y_val)
    
    # Plot training history
    plot_training_history(history)
    
    # Evaluate model
    test_accuracy, cm = evaluate_model(model, X_test, y_test, y_test_labels)
    
    # Save final model
    model.save(CONFIG["model_save_path"])
    print(f"\n✅ Model saved to: {CONFIG['model_save_path']}")
    
    # Convert to TensorFlow.js
    if convert_to_tfjs():
        print("\n" + "=" * 60)
        print("Training Complete!")
        print("=" * 60)
        print(f"Test Accuracy: {test_accuracy:.4f}")
        print(f"\nNext steps:")
        print(f"1. Copy {CONFIG['tfjs_output_dir']}/ folder to public/ml/model/")
        print(f"2. Use the model in your React component")
    else:
        print("\n⚠️  Model training complete, but TensorFlow.js conversion failed.")
        print("Install tensorflowjs: pip install tensorflowjs")

if __name__ == "__main__":
    main()


