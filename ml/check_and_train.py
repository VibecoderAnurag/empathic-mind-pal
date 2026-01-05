"""
Helper script to check prerequisites and start training
"""

import os
import sys

def check_prerequisites():
    """Check if all prerequisites are met"""
    print("=" * 60)
    print("Checking Prerequisites for Facial Emotion Training")
    print("=" * 60)
    print()
    
    all_ready = True
    
    # Check TensorFlow
    print("1. Checking TensorFlow...")
    try:
        import tensorflow as tf
        print(f"   ✅ TensorFlow {tf.__version__} installed")
    except ImportError:
        print("   ❌ TensorFlow not installed!")
        print("   Install with: pip install tensorflow")
        all_ready = False
    
    # Check other dependencies
    print("\n2. Checking other dependencies...")
    deps = ['pandas', 'numpy', 'matplotlib', 'seaborn', 'sklearn']
    for dep in deps:
        try:
            __import__(dep)
            print(f"   ✅ {dep} installed")
        except ImportError:
            print(f"   ❌ {dep} not installed!")
            all_ready = False
    
    # Check dataset
    print("\n3. Checking FER2013 dataset...")
    if os.path.exists('fer2013.csv'):
        size_mb = os.path.getsize('fer2013.csv') / (1024 * 1024)
        print(f"   ✅ fer2013.csv found ({size_mb:.1f} MB)")
    else:
        print("   ❌ fer2013.csv not found!")
        print("\n   Please download the dataset:")
        print("   1. Visit: https://www.kaggle.com/datasets/msambare/fer2013")
        print("   2. Download fer2013.csv")
        print("   3. Place it in the ml/ directory")
        print("\n   See ml/DOWNLOAD_DATASET.md for detailed instructions")
        all_ready = False
    
    # Check TensorFlow.js converter
    print("\n4. Checking TensorFlow.js converter...")
    try:
        import tensorflowjs
        print("   ✅ tensorflowjs installed")
    except ImportError:
        print("   ⚠️  tensorflowjs not installed (optional, can install later)")
        print("   Install with: pip install tensorflowjs")
    except Exception as e:
        print(f"   ⚠️  tensorflowjs has compatibility issues (will use alternative method)")
        print(f"   Error: {str(e)[:50]}...")
    
    print("\n" + "=" * 60)
    if all_ready:
        print("✅ All prerequisites met! Ready to train.")
        print("=" * 60)
        return True
    else:
        print("❌ Some prerequisites are missing. Please install them first.")
        print("=" * 60)
        return False

def main():
    if check_prerequisites():
        print("\n🚀 Starting training...")
        print("This will take 2-4 hours on CPU.\n")
        
        response = input("Continue with training? (y/n): ")
        if response.lower() == 'y':
            # Import and run training
            from train_facial_emotion import main as train_main
            train_main()
        else:
            print("Training cancelled.")
    else:
        print("\nPlease install missing prerequisites and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main()

