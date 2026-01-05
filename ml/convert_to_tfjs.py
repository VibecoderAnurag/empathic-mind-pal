"""
Convert Keras model to TensorFlow.js format
"""
import os
import sys
import warnings
warnings.filterwarnings('ignore')

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
            for f in files:
                size = os.path.getsize(os.path.join(output_dir, f)) / 1024
                print(f"    - {f} ({size:.1f} KB)")
        
        return True
        
    except ImportError:
        print("ERROR: tensorflowjs not installed!")
        print("Install with: pip install tensorflowjs")
        return False
    except Exception as e:
        print(f"ERROR: Conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = convert_model()
    sys.exit(0 if success else 1)
