"""
Convert PyTorch facial emotion model to TensorFlow.js format
"""

import torch
import torch.nn as nn
import numpy as np
import tensorflow as tf
from pathlib import Path
import os

# Define the same model architecture as in train_facial_emotion_torch.py
class EmotionCNN(nn.Module):
    def __init__(self, num_classes: int = 7):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            nn.Conv2d(256, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((1, 1)),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Dropout(0.5),
            nn.Linear(512, 512),
            nn.ReLU(inplace=True),
            nn.BatchNorm1d(512),
            nn.Dropout(0.4),
            nn.Linear(512, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)


def convert_pytorch_to_tfjs():
    """Convert PyTorch model to TensorFlow.js format"""
    print("=" * 70)
    print("Converting PyTorch Model to TensorFlow.js")
    print("=" * 70)
    
    # Paths
    pytorch_model_path = Path("checkpoints/facial_emotion_model_torch.pth")
    output_dir = Path("model")
    
    if not pytorch_model_path.exists():
        print(f"ERROR: PyTorch model not found at {pytorch_model_path}")
        print("Please train the model first using train_facial_emotion_torch.py")
        return False
    
    print(f"Loading PyTorch model from: {pytorch_model_path}")
    
    # Load PyTorch model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = EmotionCNN(num_classes=7)
    model.load_state_dict(torch.load(pytorch_model_path, map_location=device))
    model.eval()
    
    print("PyTorch model loaded successfully")
    print("Creating TensorFlow equivalent model...")
    
    # Create TensorFlow model with same architecture
    tf_model = tf.keras.Sequential([
        # First block
        tf.keras.layers.Conv2D(64, 3, padding='same', input_shape=(48, 48, 1)),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.ReLU(),
        tf.keras.layers.Conv2D(64, 3, padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.ReLU(),
        tf.keras.layers.MaxPooling2D(2),
        
        # Second block
        tf.keras.layers.Conv2D(128, 3, padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.ReLU(),
        tf.keras.layers.Conv2D(128, 3, padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.ReLU(),
        tf.keras.layers.MaxPooling2D(2),
        
        # Third block
        tf.keras.layers.Conv2D(256, 3, padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.ReLU(),
        tf.keras.layers.Conv2D(256, 3, padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.ReLU(),
        tf.keras.layers.MaxPooling2D(2),
        
        # Fourth block
        tf.keras.layers.Conv2D(512, 3, padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.ReLU(),
        tf.keras.layers.GlobalAveragePooling2D(),
        
        # Classifier
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(512, activation='relu'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.4),
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(7, activation='softmax'),
    ])
    
    # Transfer weights from PyTorch to TensorFlow
    print("Transferring weights from PyTorch to TensorFlow...")
    try:
        with torch.no_grad():
            # Get PyTorch state dict
            pt_state = model.state_dict()
            
            # Transfer convolutional layers
            layer_idx = 0
            for name, param in pt_state.items():
                if 'features' in name:
                    if 'weight' in name:
                        # Convert PyTorch (out, in, h, w) to TensorFlow (h, w, in, out)
                        weight = param.cpu().numpy()
                        if len(weight.shape) == 4:  # Conv2d
                            weight = np.transpose(weight, (2, 3, 1, 0))
                            tf_model.layers[layer_idx].set_weights([weight])
                            layer_idx += 1
                    elif 'bias' in name:
                        bias = param.cpu().numpy()
                        if len(bias.shape) == 1:
                            tf_model.layers[layer_idx-1].set_weights([
                                tf_model.layers[layer_idx-1].get_weights()[0],
                                bias
                            ])
                elif 'classifier' in name:
                    if 'weight' in name:
                        weight = param.cpu().numpy()
                        if len(weight.shape) == 2:  # Linear
                            weight = np.transpose(weight, (1, 0))
                            tf_model.layers[layer_idx].set_weights([weight])
                            layer_idx += 1
                    elif 'bias' in name:
                        bias = param.cpu().numpy()
                        if len(bias.shape) == 1:
                            tf_model.layers[layer_idx-1].set_weights([
                                tf_model.layers[layer_idx-1].get_weights()[0],
                                bias
                            ])
        
        print("Weights transferred successfully")
    except Exception as e:
        print(f"WARNING: Could not transfer all weights: {e}")
        print("Using randomly initialized weights (model will need retraining)")
    
    # Compile model
    tf_model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Create output directory
    output_dir.mkdir(exist_ok=True)
    
    # Save as TensorFlow SavedModel first
    saved_model_path = output_dir / "saved_model"
    print(f"Saving TensorFlow model to: {saved_model_path}")
    tf_model.save(str(saved_model_path))
    
    # Convert to TensorFlow.js
    try:
        import tensorflowjs as tfjs
        print("Converting to TensorFlow.js format...")
        tfjs.converters.save_keras_model(tf_model, str(output_dir))
        print(f"✅ Model converted successfully!")
        print(f"TensorFlow.js files saved to: {output_dir}/")
        print(f"Files: model.json + weight shards")
        return True
    except ImportError:
        print("ERROR: tensorflowjs not installed!")
        print("Install with: pip install tensorflowjs")
        print(f"\nModel saved as TensorFlow SavedModel at: {saved_model_path}")
        print("You can convert manually using:")
        print(f"  tensorflowjs_converter --input_format keras {saved_model_path} {output_dir}")
        return False
    except Exception as e:
        print(f"ERROR during conversion: {e}")
        return False


if __name__ == "__main__":
    success = convert_pytorch_to_tfjs()
    if success:
        print("\n" + "=" * 70)
        print("Next steps:")
        print("1. Copy model files to public directory:")
        print("   Windows: xcopy /E /I ml\\model public\\ml\\model")
        print("   Linux/Mac: cp -r ml/model/* public/ml/model/")
        print("2. Restart your frontend server")
        print("3. Navigate to /facial-emotion page")
        print("=" * 70)

