"""
Auto-training script with automatic error handling and fixes
Ensures training runs successfully on GPU
"""

import subprocess
import sys
import os
import time
from pathlib import Path

def check_gpu():
    """Check if GPU is available"""
    try:
        import torch
        if torch.cuda.is_available():
            print(f"[INFO] GPU detected: {torch.cuda.get_device_name(0)}")
            print(f"[INFO] GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
            return True
        else:
            print("[WARN] No GPU detected - training will be slow on CPU")
            return False
    except ImportError:
        print("[ERROR] PyTorch not installed")
        return False

def check_dataset():
    """Check if dataset exists"""
    data_paths = [
        Path("FER2013"),
        Path("../FER2013"),
        Path("./FER2013"),
    ]
    
    for path in data_paths:
        if path.exists() and (path / "train").exists() and (path / "test").exists():
            print(f"[INFO] Dataset found at: {path}")
            return str(path)
    
    print("[ERROR] FER2013 dataset not found!")
    print("Please ensure FER2013/train and FER2013/test directories exist")
    return None

def install_dependencies():
    """Install missing dependencies"""
    required = ['timm', 'torch', 'torchvision', 'numpy', 'pillow']
    missing = []
    
    for pkg in required:
        try:
            __import__(pkg)
        except ImportError:
            missing.append(pkg)
    
    if missing:
        print(f"[INFO] Installing missing packages: {missing}")
        for pkg in missing:
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])
        print("[INFO] Dependencies installed")
    else:
        print("[INFO] All dependencies available")

def run_training():
    """Run training with error handling"""
    # Check prerequisites
    print("=" * 80)
    print("AUTO-TRAINING SETUP")
    print("=" * 80)
    
    # Check GPU
    has_gpu = check_gpu()
    
    # Check dataset
    data_dir = check_dataset()
    if not data_dir:
        return False
    
    # Install dependencies
    install_dependencies()
    
    print("\n" + "=" * 80)
    print("STARTING TRAINING")
    print("=" * 80)
    print()
    
    # Build command
    cmd = [
        sys.executable,
        "train_facial_emotion_torch.py",
        "--model", "efficientnet_b0",
        "--data-dir", data_dir,
        "--save-dir", "checkpoints",
        "--epochs", "80",
        "--batch-size", "16",
        "--input-size", "224",
        "--optimizer", "AdamW",
        "--lr", "1e-4",
        "--weight-decay", "1e-4",
        "--scheduler", "cosine",
        "--patience", "10",
        "--use-amp",
        "--mixup", "0.2",
        "--label-smoothing", "0.1",
        "--num-workers", "4",
    ]
    
    # Auto-adjust batch size if no GPU
    if not has_gpu:
        cmd[cmd.index("--batch-size") + 1] = "8"
        print("[INFO] Reduced batch size to 8 for CPU training")
    
    print(f"Command: {' '.join(cmd)}")
    print()
    print("Training will start in 3 seconds...")
    print("Press Ctrl+C to cancel")
    time.sleep(3)
    
    # Run training
    try:
        result = subprocess.run(cmd, check=True)
        print("\n" + "=" * 80)
        print("TRAINING COMPLETED SUCCESSFULLY!")
        print("=" * 80)
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Training failed with exit code {e.returncode}")
        print("[INFO] Check the error messages above")
        return False
    except KeyboardInterrupt:
        print("\n[INFO] Training interrupted by user")
        print("[INFO] You can resume training with: --resume checkpoints/last_checkpoint.pth")
        return False
    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = run_training()
    sys.exit(0 if success else 1)

