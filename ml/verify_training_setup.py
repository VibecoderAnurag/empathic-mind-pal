"""
Comprehensive training setup verification script
Checks all prerequisites before starting training
"""

import os
import sys
import subprocess

def check_tensorflow():
    """Check TensorFlow installation"""
    print("1. Checking TensorFlow...")
    try:
        import tensorflow as tf
        version = tf.__version__
        print(f"   [OK] TensorFlow {version} installed")
        
        # Check GPU availability
        gpus = tf.config.list_physical_devices('GPU')
        if gpus:
            print(f"   [OK] GPU detected: {len(gpus)} device(s)")
            for i, gpu in enumerate(gpus):
                print(f"      - {gpu.name}")
        else:
            print("   [WARN] No GPU detected (will use CPU - training will be slower)")
        
        # Test basic functionality
        try:
            test_tensor = tf.constant([1, 2, 3])
            _ = test_tensor * 2
            print("   [OK] TensorFlow is working correctly")
            return True
        except Exception as e:
            print(f"   [ERROR] TensorFlow error: {e}")
            return False
    except ImportError:
        print("   [ERROR] TensorFlow not installed!")
        print("   Install with: pip install tensorflow")
        return False

def check_dependencies():
    """Check all required Python dependencies"""
    print("\n2. Checking Python dependencies...")
    dependencies = {
        'pandas': ('pandas', 'pandas'),
        'numpy': ('numpy', 'numpy'),
        'matplotlib': ('matplotlib', 'matplotlib'),
        'seaborn': ('seaborn', 'seaborn'),
        'scikit-learn': ('sklearn', 'scikit-learn'),
    }
    
    all_ok = True
    for dep_name, (import_name, package_name) in dependencies.items():
        try:
            module = __import__(import_name)
            version = getattr(module, '__version__', 'unknown')
            print(f"   [OK] {dep_name}: {version}")
        except ImportError:
            print(f"   [ERROR] {dep_name} not installed!")
            print(f"   Install with: pip install {package_name}")
            all_ok = False
    
    return all_ok

def check_dataset():
    """Check if FER2013 dataset exists (image directories or CSV)"""
    print("\n3. Checking FER2013 dataset...")
    
    # Check for image directory structure first (preferred)
    data_dir = 'FER2013'
    train_dir = os.path.join(data_dir, 'train')
    test_dir = os.path.join(data_dir, 'test')
    
    if os.path.exists(train_dir) and os.path.exists(test_dir):
        print(f"   [OK] FER2013 image directory found")
        
        # Check for emotion folders
        emotions = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
        all_present = True
        total_train = 0
        total_test = 0
        
        for emotion in emotions:
            train_emotion_dir = os.path.join(train_dir, emotion)
            test_emotion_dir = os.path.join(test_dir, emotion)
            
            if os.path.exists(train_emotion_dir):
                train_count = len([f for f in os.listdir(train_emotion_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
                total_train += train_count
            else:
                print(f"   [WARN] {emotion} folder not found in train/")
                all_present = False
            
            if os.path.exists(test_emotion_dir):
                test_count = len([f for f in os.listdir(test_emotion_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
                total_test += test_count
            else:
                print(f"   [WARN] {emotion} folder not found in test/")
                all_present = False
        
        if all_present:
            print(f"   [OK] All emotion folders present")
            print(f"   [OK] Training images: {total_train:,}")
            print(f"   [OK] Test images: {total_test:,}")
            print(f"   [OK] Total images: {total_train + total_test:,}")
            return True
        else:
            print("   [ERROR] Some emotion folders are missing!")
            return False
    
    # Fallback: Check for CSV file
    dataset_path = 'fer2013.csv'
    if os.path.exists(dataset_path):
        size_bytes = os.path.getsize(dataset_path)
        size_mb = size_bytes / (1024 * 1024)
        print(f"   [OK] fer2013.csv found ({size_mb:.1f} MB)")
        print("   [INFO] CSV format detected (image directories preferred)")
        
        try:
            import pandas as pd
            df = pd.read_csv(dataset_path, nrows=5)
            if 'emotion' in df.columns and 'pixels' in df.columns and 'Usage' in df.columns:
                print("   [OK] CSV format is correct")
                return True
            else:
                print("   [WARN] CSV format may not match expected format")
                print("   [INFO] Consider using image directory structure instead")
                return False
        except Exception as e:
            print(f"   [ERROR] Error reading CSV: {e}")
            return False
    else:
        print("   [ERROR] FER2013 dataset not found!")
        print("\n   Please download the dataset:")
        print("   Option 1 (Preferred): Image directories")
        print("     - FER2013/train/{emotion}/*.jpg")
        print("     - FER2013/test/{emotion}/*.jpg")
        print("   Option 2: CSV file")
        print("     - fer2013.csv with columns: emotion, pixels, Usage")
        return False

def check_directories():
    """Check if required directories exist"""
    print("\n4. Checking directories...")
    directories = ['checkpoints', 'model']
    all_ok = True
    
    for dir_name in directories:
        if os.path.exists(dir_name):
            print(f"   [OK] {dir_name}/ directory exists")
        else:
            print(f"   [WARN] {dir_name}/ directory not found (will be created)")
            try:
                os.makedirs(dir_name, exist_ok=True)
                print(f"   [OK] Created {dir_name}/ directory")
            except Exception as e:
                print(f"   [ERROR] Could not create {dir_name}/: {e}")
                all_ok = False
    
    return all_ok

def check_training_script():
    """Check if training script exists and is valid"""
    print("\n5. Checking training script...")
    script_path = 'train_facial_emotion.py'
    
    if os.path.exists(script_path):
        print(f"   [OK] {script_path} exists")
        
        # Check if script is syntactically correct
        try:
            with open(script_path, 'r', encoding='utf-8') as f:
                code = f.read()
            compile(code, script_path, 'exec')
            print("   [OK] Training script syntax is valid")
            return True
        except SyntaxError as e:
            print(f"   [ERROR] Training script has syntax errors: {e}")
            return False
        except UnicodeDecodeError:
            # Try with different encoding
            try:
                with open(script_path, 'r', encoding='latin-1') as f:
                    code = f.read()
                compile(code, script_path, 'exec')
                print("   [OK] Training script syntax is valid")
                return True
            except Exception as e:
                print(f"   [WARN] Could not verify script syntax: {e}")
                print("   (This is usually fine - script should still work)")
                return True  # Don't block training
    else:
        print(f"   [ERROR] {script_path} not found!")
        return False

def check_tensorflowjs():
    """Check TensorFlow.js converter"""
    print("\n6. Checking TensorFlow.js converter...")
    try:
        import tensorflowjs
        print("   [OK] tensorflowjs installed")
        return True
    except ImportError:
        print("   [WARN] tensorflowjs not installed")
        print("   The training will complete, but conversion may fail")
        print("   You can install it later: pip install tensorflowjs")
        print("   Or convert manually using command line tools")
        return False  # Not critical, but good to have
    except Exception as e:
        print(f"   [WARN] tensorflowjs has compatibility issues: {str(e)[:50]}...")
        print("   The training script will use alternative conversion methods")
        return True  # Script handles this

def check_disk_space():
    """Check available disk space"""
    print("\n7. Checking disk space...")
    try:
        import shutil
        total, used, free = shutil.disk_usage('.')
        free_gb = free / (1024 ** 3)
        print(f"   [OK] Available disk space: {free_gb:.1f} GB")
        
        if free_gb < 5:
            print("   [WARN] Low disk space! Recommended: at least 5 GB free")
            return False
        else:
            print("   [OK] Sufficient disk space available")
            return True
    except Exception:
        print("   [WARN] Could not check disk space")
        return True  # Don't block training

def check_memory():
    """Check available memory (basic check)"""
    print("\n8. Checking system resources...")
    try:
        import psutil
        memory = psutil.virtual_memory()
        available_gb = memory.available / (1024 ** 3)
        print(f"   [OK] Available RAM: {available_gb:.1f} GB")
        
        if available_gb < 4:
            print("   [WARN] Low RAM! Training may be slow or fail")
            print("   Recommended: at least 8 GB RAM for comfortable training")
            return False
        else:
            print("   [OK] Sufficient RAM available")
            return True
    except ImportError:
        print("   [WARN] Could not check memory (psutil not installed)")
        print("   This is optional - training should work anyway")
        return True

def main():
    """Run all checks"""
    print("=" * 70)
    print("FACIAL EMOTION TRAINING - PRE-TRAINING VERIFICATION")
    print("=" * 70)
    print()
    
    results = {
        'TensorFlow': check_tensorflow(),
        'Dependencies': check_dependencies(),
        'Dataset': check_dataset(),
        'Directories': check_directories(),
        'Training Script': check_training_script(),
        'TensorFlow.js': check_tensorflowjs(),
        'Disk Space': check_disk_space(),
        'Memory': check_memory(),
    }
    
    print("\n" + "=" * 70)
    print("VERIFICATION SUMMARY")
    print("=" * 70)
    print()
    
    critical_checks = ['TensorFlow', 'Dependencies', 'Dataset', 'Training Script']
    all_critical_ok = all(results[check] for check in critical_checks)
    
    for check_name, result in results.items():
        status = "[PASS]" if result else "[FAIL]"
        critical = " (CRITICAL)" if check_name in critical_checks else ""
        print(f"  {status} - {check_name}{critical}")
    
    print()
    print("=" * 70)
    
    if all_critical_ok:
        print("[SUCCESS] ALL CRITICAL CHECKS PASSED!")
        print("=" * 70)
        print("\n[READY] You are ready to start training!")
        print("\nTo start training, run:")
        print("  python train_facial_emotion.py")
        print("\nOr use the helper script:")
        print("  python check_and_train.py")
        print("\n[INFO] Training will take 2-4 hours on CPU, 30-60 minutes on GPU")
        print("=" * 70)
        return True
    else:
        print("[ERROR] SOME CRITICAL CHECKS FAILED!")
        print("=" * 70)
        print("\nPlease fix the issues above before starting training.")
        print("=" * 70)
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

