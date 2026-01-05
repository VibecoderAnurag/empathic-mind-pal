"""Test script to check training setup and identify errors"""

import sys
import os
from pathlib import Path

print("=" * 80)
print("TESTING TRAINING SETUP")
print("=" * 80)

# Test 1: Check Python version
print("\n[1] Checking Python version...")
print(f"Python: {sys.version}")

# Test 2: Check imports
print("\n[2] Checking imports...")
try:
    import torch
    print(f"✓ PyTorch: {torch.__version__}")
    print(f"  CUDA available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"  GPU: {torch.cuda.get_device_name(0)}")
except ImportError as e:
    print(f"✗ PyTorch import failed: {e}")
    sys.exit(1)

try:
    import timm
    print(f"✓ timm: {timm.__version__}")
except ImportError as e:
    print(f"✗ timm import failed: {e}")
    print("  Installing timm...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "timm"])
    import timm
    print(f"✓ timm installed: {timm.__version__}")

try:
    import torchvision
    print(f"✓ torchvision: {torchvision.__version__}")
except ImportError as e:
    print(f"✗ torchvision import failed: {e}")

try:
    import numpy
    print(f"✓ numpy: {numpy.__version__}")
except ImportError as e:
    print(f"✗ numpy import failed: {e}")

# Test 3: Check dataset
print("\n[3] Checking dataset...")
data_paths = [
    Path("FER2013"),
    Path("../FER2013"),
    Path("./FER2013"),
]

dataset_found = False
for path in data_paths:
    if path.exists():
        train_dir = path / "train"
        test_dir = path / "test"
        if train_dir.exists() and test_dir.exists():
            print(f"✓ Dataset found at: {path.absolute()}")
            # Count images
            total_train = sum(len(list((train_dir / emotion).glob("*.jpg"))) 
                            for emotion in ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
                            if (train_dir / emotion).exists())
            total_test = sum(len(list((test_dir / emotion).glob("*.jpg"))) 
                           for emotion in ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
                           if (test_dir / emotion).exists())
            print(f"  Training images: {total_train:,}")
            print(f"  Test images: {total_test:,}")
            dataset_found = True
            break

if not dataset_found:
    print("✗ Dataset not found!")
    print("  Expected: FER2013/train/ and FER2013/test/ directories")
    sys.exit(1)

# Test 4: Test model creation
print("\n[4] Testing model creation...")
try:
    import timm
    model = timm.create_model("efficientnet_b0", pretrained=True, num_classes=7, in_chans=3)
    print(f"✓ Model created successfully")
    print(f"  Parameters: {sum(p.numel() for p in model.parameters()):,}")
except Exception as e:
    print(f"✗ Model creation failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 5: Test data loading
print("\n[5] Testing data loading...")
try:
    from torchvision import datasets, transforms
    
    test_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    
    for path in data_paths:
        if path.exists():
            train_dir = path / "train"
            if train_dir.exists():
                dataset = datasets.ImageFolder(str(train_dir), transform=test_transform)
                print(f"✓ Dataset loaded: {len(dataset)} samples")
                # Test loading one sample
                sample, label = dataset[0]
                print(f"  Sample shape: {sample.shape}")
                print(f"  Label: {label}")
                break
except Exception as e:
    print(f"✗ Data loading failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 80)
print("✓ ALL TESTS PASSED - Ready for training!")
print("=" * 80)
print("\nYou can now run:")
print("  python train_facial_emotion_torch.py --model efficientnet_b0 --epochs 80 --batch-size 16 --input-size 224")

