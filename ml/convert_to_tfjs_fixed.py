"""
Convert Keras model to TensorFlow.js format (with numpy compatibility fix)
"""
import os
import sys
import warnings
warnings.filterwarnings('ignore')

# Fix numpy compatibility issue with tensorflowjs
import numpy as np
if not hasattr(np, 'bool'):
    np.bool = np.bool_
if not hasattr(np, 'object'):
    np.object = np.object_

def convert_model():
    """Convert facial emotion model to TensorFlow.js"""
    print("=" * 70)
    print("Converting Facial Emotion Model to TensorFlow.js")
    print("=" * 70)
    
    model_path = "checkpoints/facial_emotion_model.h5"
    output_dir = "model"
    
    if not os.path.exists(model_path):
        print(f"ERROR: Model not found at {model_path}")
        print("Please train the model first using train_facial_emotion.py")
        return False
    
    try:
        # Import after numpy fix
        import tensorflowjs as tfjs
        print(f"[INFO] Loading model from {model_path}...")
        
        import tensorflow as tf
        model = tf.keras.models.load_model(model_path)
        print(f"[OK] Model loaded successfully")
        print(f"  Input shape: {model.input_shape}")
        print(f"  Output shape: {model.output_shape}")
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        print(f"\n[INFO] Converting to TensorFlow.js format...")
        print(f"  Output directory: {output_dir}/")
        
        # Convert model
        tfjs.converters.save_keras_model(model, output_dir)
        
        print(f"\n[OK] Model converted successfully!")
        print(f"  Files saved to: {output_dir}/")
        
        # List generated files
        if os.path.exists(output_dir):
            files = os.listdir(output_dir)
            print(f"\n  Generated files:")
            total_size = 0
            for f in files:
                size = os.path.getsize(os.path.join(output_dir, f)) / 1024
                total_size += size
                print(f"    - {f} ({size:.1f} KB)")
            print(f"\n  Total size: {total_size:.1f} KB")
        
        return True
        
    except Exception as e:
        print(f"ERROR: Conversion failed: {e}")
        import traceback
        traceback.print_exc()
        print("\n[INFO] Trying alternative: Using TensorFlow SavedModel format...")
        return convert_to_savedmodel(model_path, output_dir)

def convert_to_savedmodel(model_path, output_dir):
    """Alternative: Save as SavedModel which can be converted later"""
    try:
        import tensorflow as tf
        print(f"[INFO] Loading model...")
        model = tf.keras.models.load_model(model_path)
        
        savedmodel_dir = output_dir + "_savedmodel"
        os.makedirs(savedmodel_dir, exist_ok=True)
        
        print(f"[INFO] Saving as SavedModel to {savedmodel_dir}/")
        model.save(savedmodel_dir)
        
        print(f"[OK] SavedModel created. You can convert it later with:")
        print(f"  tensorflowjs_converter --input_format=tf_saved_model {savedmodel_dir} {output_dir}")
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == "__main__":
    success = convert_model()
    sys.exit(0 if success else 1)

