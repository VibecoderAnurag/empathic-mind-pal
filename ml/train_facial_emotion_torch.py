"""
High-Accuracy Facial Emotion Recognition Training Pipeline
Uses EfficientNet-B0/ResNet50 with advanced techniques for maximum accuracy
GPU-optimized with auto-adjustments and error handling
"""

from __future__ import annotations

import argparse
import json
import os
import random
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, Tuple, Optional

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Subset, WeightedRandomSampler
from torchvision import transforms, datasets
try:
    from torch.amp import autocast, GradScaler
except ImportError:
    # Fallback for older PyTorch versions
    from torch.cuda.amp import autocast, GradScaler
import numpy as np

# Try to import timm, install if missing
try:
    import timm
    try:
        from timm.data.mixup import Mixup
    except ImportError:
        from timm.data import Mixup
    try:
        from timm.loss import LabelSmoothingCrossEntropy
    except ImportError:
        # Fallback if not available
        class LabelSmoothingCrossEntropy(nn.Module):
            def __init__(self, smoothing=0.1):
                super().__init__()
                self.smoothing = smoothing
            
            def forward(self, pred, target):
                log_prob = nn.functional.log_softmax(pred, dim=1)
                nll_loss = -log_prob.gather(dim=1, index=target.unsqueeze(1)).squeeze(1)
                smooth_loss = -log_prob.mean(dim=1)
                loss = (1 - self.smoothing) * nll_loss + self.smoothing * smooth_loss
                return loss.mean()
except ImportError:
    print("[INFO] Installing timm library...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "timm"])
    import timm
    try:
        from timm.data.mixup import Mixup
    except ImportError:
        from timm.data import Mixup
    try:
        from timm.loss import LabelSmoothingCrossEntropy
    except ImportError:
        class LabelSmoothingCrossEntropy(nn.Module):
            def __init__(self, smoothing=0.1):
                super().__init__()
                self.smoothing = smoothing
            
            def forward(self, pred, target):
                log_prob = nn.functional.log_softmax(pred, dim=1)
                nll_loss = -log_prob.gather(dim=1, index=target.unsqueeze(1)).squeeze(1)
                smooth_loss = -log_prob.mean(dim=1)
                loss = (1 - self.smoothing) * nll_loss + self.smoothing * smooth_loss
                return loss.mean()

EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
NUM_CLASSES = len(EMOTIONS)


def set_seed(seed: int = 42) -> None:
    """Set random seeds for reproducibility"""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False


def get_device(use_cpu: bool = False) -> torch.device:
    """Get the best available device"""
    if use_cpu:
        print("[INFO] Forcing CPU usage")
        return torch.device("cpu")
    
    if torch.cuda.is_available():
        device = torch.device("cuda")
        print(f"[INFO] Using CUDA GPU: {torch.cuda.get_device_name(0)}")
        print(f"[INFO] GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
        return device
    
    try:
        if torch.backends.mps.is_available():
            print("[INFO] Using Apple Silicon (MPS) GPU")
            return torch.device("mps")
    except AttributeError:
        pass
    
    print("[WARN] No GPU available, falling back to CPU")
    return torch.device("cpu")


def build_transforms(
    img_size: int = 224,
    is_train: bool = True
) -> transforms.Compose:
    """Build data augmentation transforms"""
    if is_train:
        return transforms.Compose([
            transforms.Resize((img_size + 32, img_size + 32)),
            transforms.RandomCrop(img_size),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomRotation(15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
            transforms.RandomAffine(degrees=0, translate=(0.1, 0.1), scale=(0.9, 1.1)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
    else:
        return transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])


def create_dataloaders(
    data_dir: Path,
    batch_size: int,
    img_size: int = 224,
    val_split: float = 0.1,
    num_workers: int = 4,
    device: torch.device = None,
) -> Tuple[DataLoader, DataLoader, DataLoader]:
    """Create train/val/test dataloaders with auto batch size adjustment"""
    train_dir = data_dir / "train"
    test_dir = data_dir / "test"
    
    if not train_dir.exists() or not test_dir.exists():
        raise FileNotFoundError(f"Dataset directories not found: {train_dir} or {test_dir}")
    
    train_tfms = build_transforms(img_size, is_train=True)
    eval_tfms = build_transforms(img_size, is_train=False)
    
    # Load datasets
    base_dataset = datasets.ImageFolder(train_dir, transform=train_tfms)
    val_dataset = datasets.ImageFolder(train_dir, transform=eval_tfms)
    test_dataset = datasets.ImageFolder(test_dir, transform=eval_tfms)
    
    # Split train/val
    total_size = len(base_dataset)
    val_size = max(1, int(total_size * val_split))
    train_size = total_size - val_size
    
    set_seed(42)
    indices = torch.randperm(total_size).tolist()
    val_indices = indices[:val_size]
    train_indices = indices[val_size:]
    
    train_subset = Subset(base_dataset, train_indices)
    val_subset = Subset(val_dataset, val_indices)
    
    # Auto-adjust batch size if GPU memory is low
    if device and device.type == "cuda":
        try:
            # Test batch size
            test_loader = DataLoader(
                train_subset,
                batch_size=batch_size,
                shuffle=True,
                num_workers=num_workers,
                pin_memory=True,
            )
            # Try to load a batch
            sample_batch = next(iter(test_loader))
            images = sample_batch[0].to(device)
            del images, sample_batch
            torch.cuda.empty_cache()
            print(f"[INFO] Batch size {batch_size} works on GPU")
        except RuntimeError as e:
            if "out of memory" in str(e):
                print(f"[WARN] GPU OOM with batch size {batch_size}, reducing...")
                batch_size = max(4, batch_size // 2)
                print(f"[INFO] Using batch size: {batch_size}")
                torch.cuda.empty_cache()
    
    # Create loaders
    loader_kwargs = {
        "batch_size": batch_size,
        "num_workers": num_workers,
        "pin_memory": device.type == "cuda" if device else False,
    }
    
    train_loader = DataLoader(train_subset, shuffle=True, **loader_kwargs)
    val_loader = DataLoader(val_subset, shuffle=False, **loader_kwargs)
    test_loader = DataLoader(test_dataset, shuffle=False, **loader_kwargs)
    
    print(f"[INFO] Training samples: {len(train_subset)}")
    print(f"[INFO] Validation samples: {len(val_subset)}")
    print(f"[INFO] Test samples: {len(test_dataset)}")
    print(f"[INFO] Batch size: {batch_size}")
    
    return train_loader, val_loader, test_loader, batch_size


def build_model(
    model_name: str = "efficientnet_b0",
    num_classes: int = NUM_CLASSES,
    pretrained: bool = True,
) -> nn.Module:
    """Build model from timm"""
    try:
        # Create model
        model = timm.create_model(
            model_name,
            pretrained=pretrained,
            num_classes=num_classes,
            in_chans=3,  # RGB input
        )
        print(f"[INFO] Created model: {model_name}")
        print(f"[INFO] Model parameters: {sum(p.numel() for p in model.parameters()):,}")
        return model
    except Exception as e:
        print(f"[ERROR] Failed to create model {model_name}: {e}")
        print("[INFO] Falling back to efficientnet_b0")
        return timm.create_model(
            "efficientnet_b0",
            pretrained=True,
            num_classes=num_classes,
            in_chans=3,
        )


def train_epoch(
    model: nn.Module,
    train_loader: DataLoader,
    criterion: nn.Module,
    optimizer: optim.Optimizer,
    device: torch.device,
    mixup_fn: Optional[Mixup] = None,
    use_amp: bool = True,
    scaler: Optional[GradScaler] = None,
) -> Tuple[float, float]:
    """Train for one epoch"""
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    batch_time = 0.0
    
    for batch_idx, (images, targets) in enumerate(train_loader):
        batch_start = time.time()
        
        images = images.to(device, non_blocking=True)
        targets = targets.to(device, non_blocking=True)
        
        # Save original targets for accuracy calculation
        original_targets = targets.clone()
        
        # Apply mixup if enabled
        use_mixup = False
        mixup_targets = None
        if mixup_fn is not None:
            try:
                images, mixup_targets = mixup_fn(images, targets)
                # Check if mixup returned one-hot encoded targets (2D) or tuple
                if isinstance(mixup_targets, tuple):
                    use_mixup = True
                elif mixup_targets.dim() == 2 and mixup_targets.shape[1] > 1:
                    # One-hot encoded targets from mixup
                    use_mixup = True
                else:
                    # Regular targets, not actually mixed
                    mixup_targets = None
            except Exception as e:
                print(f"[WARN] Mixup failed: {e}, continuing without mixup")
                mixup_targets = None
                use_mixup = False
        
        optimizer.zero_grad()
        
        # Forward pass with AMP (compatible with all PyTorch versions)
        if use_amp and device.type == "cuda":
            try:
                # Try new API (PyTorch 2.0+)
                with autocast('cuda'):
                    outputs = model(images)
                    
                    # Handle loss calculation
                    if use_mixup and mixup_targets is not None:
                        if isinstance(mixup_targets, tuple):
                            # Mixup tuple format: (mixed_target, lambda, target_a, target_b)
                            target_a = mixup_targets[2].long().squeeze() if len(mixup_targets) > 2 else None
                            target_b = mixup_targets[3].long().squeeze() if len(mixup_targets) > 3 else None
                            lam = mixup_targets[1] if len(mixup_targets) > 1 else 0.5
                            
                            if target_a is not None and target_b is not None:
                                ce_loss = nn.CrossEntropyLoss()
                                loss = lam * ce_loss(outputs, target_a) + (1 - lam) * ce_loss(outputs, target_b)
                            else:
                                # Fallback to one-hot loss
                                loss = -torch.sum(mixup_targets * torch.log_softmax(outputs, dim=1), dim=1).mean()
                        elif mixup_targets.dim() == 2:
                            # One-hot encoded targets from mixup
                            loss = -torch.sum(mixup_targets * torch.log_softmax(outputs, dim=1), dim=1).mean()
                        else:
                            # Convert to class indices if needed
                            if mixup_targets.dim() > 1:
                                mixup_targets = mixup_targets.argmax(dim=1)
                            mixup_targets = mixup_targets.long().squeeze()
                            if mixup_targets.dim() == 0:
                                mixup_targets = mixup_targets.unsqueeze(0)
                            loss = criterion(outputs, mixup_targets)
                    else:
                        # Regular targets - ensure int64 and 1D
                        if isinstance(targets, tuple):
                            targets = targets[0]  # Get first element if tuple
                        # Ensure targets are 1D long tensor
                        targets = targets.long()
                        if targets.dim() > 1:
                            # If 2D, convert from one-hot to class indices
                            targets = targets.argmax(dim=1)
                        if targets.dim() == 0:
                            targets = targets.unsqueeze(0)
                        # Final check: must be 1D
                        assert targets.dim() == 1, f"Targets must be 1D, got shape {targets.shape}"
                        loss = criterion(outputs, targets)
            except (TypeError, ValueError):
                # Fallback to old API
                with autocast():
                    outputs = model(images)
                    
                    # Handle loss calculation
                    if use_mixup and mixup_targets is not None:
                        if isinstance(mixup_targets, tuple):
                            target_a = mixup_targets[2].long().squeeze() if len(mixup_targets) > 2 else None
                            target_b = mixup_targets[3].long().squeeze() if len(mixup_targets) > 3 else None
                            lam = mixup_targets[1] if len(mixup_targets) > 1 else 0.5
                            
                            if target_a is not None and target_b is not None:
                                ce_loss = nn.CrossEntropyLoss()
                                loss = lam * ce_loss(outputs, target_a) + (1 - lam) * ce_loss(outputs, target_b)
                            else:
                                loss = -torch.sum(mixup_targets * torch.log_softmax(outputs, dim=1), dim=1).mean()
                        elif mixup_targets.dim() == 2:
                            loss = -torch.sum(mixup_targets * torch.log_softmax(outputs, dim=1), dim=1).mean()
                        else:
                            if mixup_targets.dim() > 1:
                                mixup_targets = mixup_targets.argmax(dim=1)
                            mixup_targets = mixup_targets.long().squeeze()
                            if mixup_targets.dim() == 0:
                                mixup_targets = mixup_targets.unsqueeze(0)
                            loss = criterion(outputs, mixup_targets)
                    else:
                        if isinstance(targets, tuple):
                            targets = targets[0]
                        targets = targets.long()
                        if targets.dim() > 1:
                            targets = targets.argmax(dim=1)
                        if targets.dim() == 0:
                            targets = targets.unsqueeze(0)
                        assert targets.dim() == 1, f"Targets must be 1D, got shape {targets.shape}"
                        loss = criterion(outputs, targets)
        else:
            outputs = model(images)
            
            if use_mixup and mixup_targets is not None:
                if isinstance(mixup_targets, tuple):
                    # Mixup tuple format
                    target_a = mixup_targets[2].long().squeeze() if len(mixup_targets) > 2 else None
                    target_b = mixup_targets[3].long().squeeze() if len(mixup_targets) > 3 else None
                    lam = mixup_targets[1] if len(mixup_targets) > 1 else 0.5
                    
                    if target_a is not None and target_b is not None:
                        ce_loss = nn.CrossEntropyLoss()
                        loss = lam * ce_loss(outputs, target_a) + (1 - lam) * ce_loss(outputs, target_b)
                    else:
                        loss = -torch.sum(mixup_targets * torch.log_softmax(outputs, dim=1), dim=1).mean()
                elif mixup_targets.dim() == 2:
                    # One-hot encoded targets from mixup
                    loss = -torch.sum(mixup_targets * torch.log_softmax(outputs, dim=1), dim=1).mean()
                else:
                    if mixup_targets.dim() > 1:
                        mixup_targets = mixup_targets.argmax(dim=1)
                    mixup_targets = mixup_targets.long().squeeze()
                    if mixup_targets.dim() == 0:
                        mixup_targets = mixup_targets.unsqueeze(0)
                    loss = criterion(outputs, mixup_targets)
            else:
                # Regular targets - ensure int64 and 1D
                if isinstance(targets, tuple):
                    targets = targets[0]  # Get first element if tuple
                # Ensure targets are 1D long tensor
                targets = targets.long()
                if targets.dim() > 1:
                    # If 2D, convert from one-hot to class indices
                    targets = targets.argmax(dim=1)
                if targets.dim() == 0:
                    targets = targets.unsqueeze(0)
                # Final check: must be 1D
                assert targets.dim() == 1, f"Targets must be 1D, got shape {targets.shape}"
                loss = criterion(outputs, targets)
        
        # Backward pass
        if use_amp and scaler:
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
        else:
            loss.backward()
            optimizer.step()
        
        # Calculate accuracy (use original targets, skip during mixup)
        if not use_mixup:
            _, predicted = outputs.max(1)
            # Use original targets for accuracy calculation
            targets_for_acc = original_targets.long()
            if targets_for_acc.dim() > 1:
                targets_for_acc = targets_for_acc.argmax(dim=1)
            targets_for_acc = targets_for_acc.squeeze()
            if targets_for_acc.dim() == 0:
                targets_for_acc = targets_for_acc.unsqueeze(0)
            total += targets_for_acc.size(0)
            correct += predicted.eq(targets_for_acc).sum().item()
        
        running_loss += loss.item()
        batch_time += time.time() - batch_start
        
        # Log progress
        if (batch_idx + 1) % 50 == 0 or (batch_idx + 1) == len(train_loader):
            avg_loss = running_loss / (batch_idx + 1)
            acc = correct / total if total > 0 else 0.0
            avg_time = batch_time / (batch_idx + 1) * 1000  # ms
            print(
                f"  Batch [{batch_idx+1}/{len(train_loader)}] | "
                f"Loss: {avg_loss:.4f} | Acc: {acc:.4f} | "
                f"Time: {avg_time:.1f}ms/batch",
                end='\r'
            )
    
    epoch_loss = running_loss / len(train_loader)
    epoch_acc = correct / total if total > 0 else 0.0
    
    return epoch_loss, epoch_acc


@torch.no_grad()
def evaluate(
    model: nn.Module,
    loader: DataLoader,
    criterion: nn.Module,
    device: torch.device,
    use_amp: bool = True,
) -> Tuple[float, float]:
    """Evaluate model"""
    model.eval()
    total_loss = 0.0
    correct = 0
    total = 0
    
    for images, targets in loader:
        images = images.to(device, non_blocking=True)
        targets = targets.to(device, non_blocking=True)
        
        # Forward pass with AMP (compatible with all PyTorch versions)
        if use_amp and device.type == "cuda":
            try:
                # Try new API (PyTorch 2.0+)
                with autocast('cuda'):
                    outputs = model(images)
                    # Ensure targets are 1D long tensor
                    targets = targets.long().squeeze()
                    if targets.dim() == 0:
                        targets = targets.unsqueeze(0)
                    loss = criterion(outputs, targets)
            except (TypeError, ValueError):
                # Fallback to old API
                with autocast():
                    outputs = model(images)
                    # Ensure targets are 1D long tensor
                    targets = targets.long().squeeze()
                    if targets.dim() == 0:
                        targets = targets.unsqueeze(0)
                    loss = criterion(outputs, targets)
        else:
            outputs = model(images)
            # Ensure targets are 1D long tensor
            targets = targets.long().squeeze()
            if targets.dim() == 0:
                targets = targets.unsqueeze(0)
            loss = criterion(outputs, targets)
        
        total_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        total += targets.size(0)
        correct += predicted.eq(targets).sum().item()
    
    avg_loss = total_loss / total
    accuracy = correct / total
    return avg_loss, accuracy


def train(
    model: nn.Module,
    train_loader: DataLoader,
    val_loader: DataLoader,
    device: torch.device,
    epochs: int,
    lr: float,
    weight_decay: float,
    scheduler_type: str,
    patience: int,
    use_amp: bool,
    mixup_alpha: float,
    label_smoothing: float,
    resume_path: Optional[str] = None,
) -> Dict[str, list]:
    """Main training loop"""
    
    # Loss function with label smoothing
    if label_smoothing > 0:
        criterion = LabelSmoothingCrossEntropy(smoothing=label_smoothing)
    else:
        criterion = nn.CrossEntropyLoss()
    
    # Optimizer
    optimizer = optim.AdamW(
        model.parameters(),
        lr=lr,
        weight_decay=weight_decay,
    )
    
    # Learning rate scheduler
    if scheduler_type == "cosine":
        scheduler = optim.lr_scheduler.CosineAnnealingLR(
            optimizer, T_max=epochs, eta_min=1e-6
        )
    elif scheduler_type == "plateau":
        scheduler = optim.lr_scheduler.ReduceLROnPlateau(
            optimizer, mode='min', factor=0.5, patience=3, min_lr=1e-6
        )
    else:
        scheduler = None
    
    # Mixup
    mixup_fn = None
    if mixup_alpha > 0:
        try:
            mixup_fn = Mixup(
                mixup_alpha=mixup_alpha,
                cutmix_alpha=0.0,
                prob=1.0,
                switch_prob=0.5,
                mode='batch',
                num_classes=NUM_CLASSES,
            )
            print(f"[INFO] Mixup enabled with alpha={mixup_alpha}")
        except Exception as e:
            print(f"[WARN] Mixup initialization failed: {e}")
            print("[INFO] Continuing without mixup")
            mixup_fn = None
    
    # AMP scaler (compatible with all PyTorch versions)
    if use_amp and device.type == "cuda":
        try:
            # Try new API first (PyTorch 2.0+)
            scaler = GradScaler('cuda')
        except (TypeError, ValueError):
            # Fallback to old API for older PyTorch versions
            try:
                scaler = GradScaler()
            except Exception:
                # If both fail, disable AMP
                print("[WARN] AMP scaler initialization failed, disabling AMP")
                use_amp = False
                scaler = None
    else:
        scaler = None
    
    # Resume training
    start_epoch = 0
    best_val_acc = 0.0
    history = {"train_loss": [], "train_acc": [], "val_loss": [], "val_acc": []}
    
    if resume_path and os.path.exists(resume_path):
        print(f"[INFO] Resuming from {resume_path}")
        checkpoint = torch.load(resume_path, map_location=device)
        model.load_state_dict(checkpoint['model_state_dict'])
        optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        start_epoch = checkpoint['epoch'] + 1
        best_val_acc = checkpoint.get('best_val_acc', 0.0)
        history = checkpoint.get('history', history)
        if scaler and 'scaler_state_dict' in checkpoint:
            scaler.load_state_dict(checkpoint['scaler_state_dict'])
        print(f"[INFO] Resumed from epoch {start_epoch}, best val acc: {best_val_acc:.4f}")
    
    print("\n" + "=" * 80)
    print("TRAINING STARTED")
    print("=" * 80)
    print(f"Device: {device}")
    print(f"Epochs: {epochs} (starting from {start_epoch})")
    print(f"Learning Rate: {lr}")
    print(f"Batch Size: {train_loader.batch_size}")
    print(f"Mixup: {mixup_alpha > 0}")
    print(f"Label Smoothing: {label_smoothing}")
    print(f"AMP: {use_amp}")
    print("=" * 80 + "\n")
    
    epochs_without_improvement = 0
    
    for epoch in range(start_epoch, epochs):
        epoch_start = time.time()
        
        # Train
        train_loss, train_acc = train_epoch(
            model, train_loader, criterion, optimizer, device,
            mixup_fn, use_amp, scaler
        )
        
        # Validate
        val_loss, val_acc = evaluate(model, val_loader, criterion, device, use_amp)
        
        # Update scheduler
        if scheduler:
            if scheduler_type == "cosine":
                scheduler.step()
            elif scheduler_type == "plateau":
                scheduler.step(val_loss)
        
        current_lr = optimizer.param_groups[0]['lr']
        epoch_time = time.time() - epoch_start
        
        # Save history
        history["train_loss"].append(train_loss)
        history["train_acc"].append(train_acc)
        history["val_loss"].append(val_loss)
        history["val_acc"].append(val_acc)
        
        # Print epoch results
        print(f"\nEpoch [{epoch+1}/{epochs}] | "
              f"Train Loss: {train_loss:.4f} Acc: {train_acc:.4f} | "
              f"Val Loss: {val_loss:.4f} Acc: {val_acc:.4f} | "
              f"LR: {current_lr:.6f} | "
              f"Time: {epoch_time:.1f}s")
        
        # GPU memory info
        if device.type == "cuda":
            memory_used = torch.cuda.memory_allocated(device) / 1e9
            memory_reserved = torch.cuda.memory_reserved(device) / 1e9
            print(f"  GPU Memory: {memory_used:.2f}GB / {memory_reserved:.2f}GB")
        
        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            epochs_without_improvement = 0
            
            checkpoint = {
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'best_val_acc': best_val_acc,
                'history': history,
            }
            if scaler:
                checkpoint['scaler_state_dict'] = scaler.state_dict()
            
            torch.save(checkpoint, "checkpoints/best_model.pth")
            print(f"[INFO] ✓ Saved best model (val_acc={best_val_acc:.4f})")
        else:
            epochs_without_improvement += 1
            if epochs_without_improvement >= patience:
                print(f"[INFO] Early stopping triggered (patience={patience})")
                break
        
        # Save checkpoint for resume
        checkpoint = {
            'epoch': epoch,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'best_val_acc': best_val_acc,
            'history': history,
        }
        if scaler:
            checkpoint['scaler_state_dict'] = scaler.state_dict()
        torch.save(checkpoint, "checkpoints/last_checkpoint.pth")
    
    return history


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="High-Accuracy Facial Emotion Recognition Training"
    )
    parser.add_argument("--model", type=str, default="efficientnet_b0",
                       choices=["efficientnet_b0", "efficientnet_b1", "resnet50", "resnet34"],
                       help="Model architecture")
    parser.add_argument("--data-dir", type=Path, default=Path("FER2013"),
                       help="Path to FER2013 directory")
    parser.add_argument("--save-dir", type=Path, default=Path("checkpoints"),
                       help="Directory to save checkpoints")
    parser.add_argument("--epochs", type=int, default=80, help="Number of epochs")
    parser.add_argument("--batch-size", type=int, default=16, help="Batch size")
    parser.add_argument("--input-size", type=int, default=224, help="Input image size")
    parser.add_argument("--optimizer", type=str, default="AdamW", help="Optimizer")
    parser.add_argument("--lr", type=float, default=1e-4, help="Learning rate")
    parser.add_argument("--weight-decay", type=float, default=1e-4, help="Weight decay")
    parser.add_argument("--scheduler", type=str, default="cosine",
                       choices=["cosine", "plateau", "none"],
                       help="LR scheduler type")
    parser.add_argument("--patience", type=int, default=10, help="Early stopping patience")
    parser.add_argument("--use-amp", action="store_true", default=True,
                       help="Use Automatic Mixed Precision")
    parser.add_argument("--mixup", type=float, default=0.2, help="Mixup alpha")
    parser.add_argument("--label-smoothing", type=float, default=0.1,
                       help="Label smoothing factor")
    parser.add_argument("--num-workers", type=int, default=4, help="DataLoader workers")
    parser.add_argument("--val-split", type=float, default=0.1, help="Validation split")
    parser.add_argument("--resume", type=str, default=None,
                       help="Resume from checkpoint")
    parser.add_argument("--use-cpu", action="store_true", help="Force CPU")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    
    # Set seed
    set_seed(42)
    
    # Get device
    device = get_device(use_cpu=args.use_cpu)
    
    # Enable optimizations
    if device.type == "cuda":
        torch.backends.cudnn.benchmark = True
        torch.backends.cudnn.deterministic = False
    
    # Create save directory
    args.save_dir.mkdir(exist_ok=True)
    
    print("=" * 80)
    print("HIGH-ACCURACY FACIAL EMOTION RECOGNITION TRAINING")
    print("=" * 80)
    print(f"Model: {args.model}")
    print(f"Device: {device}")
    print(f"Input Size: {args.input_size}x{args.input_size}")
    print(f"Epochs: {args.epochs}")
    print(f"Batch Size: {args.batch_size}")
    print(f"Learning Rate: {args.lr}")
    print(f"Mixup: {args.mixup}")
    print(f"Label Smoothing: {args.label_smoothing}")
    print("=" * 80)
    print()
    
    # Create dataloaders
    print("[INFO] Creating dataloaders...")
    try:
        train_loader, val_loader, test_loader, actual_batch_size = create_dataloaders(
            data_dir=args.data_dir,
            batch_size=args.batch_size,
            img_size=args.input_size,
            val_split=args.val_split,
            num_workers=args.num_workers,
            device=device,
        )
    except Exception as e:
        print(f"[ERROR] Failed to create dataloaders: {e}")
        print("[INFO] Trying to fix dataset path...")
        # Try alternative paths
        alt_paths = [Path("FER2013"), Path("../FER2013"), Path("./FER2013")]
        for alt_path in alt_paths:
            if alt_path.exists():
                args.data_dir = alt_path
                print(f"[INFO] Using dataset path: {alt_path}")
                train_loader, val_loader, test_loader, actual_batch_size = create_dataloaders(
                    data_dir=args.data_dir,
                    batch_size=args.batch_size,
                    img_size=args.input_size,
                    val_split=args.val_split,
                    num_workers=args.num_workers,
                    device=device,
                )
                break
        else:
            raise FileNotFoundError("Could not find FER2013 dataset")
    
    # Build model
    print("[INFO] Building model...")
    model = build_model(
        model_name=args.model,
        num_classes=NUM_CLASSES,
        pretrained=True,
    )
    model = model.to(device)
    
    # Train
    print("[INFO] Starting training...")
    history = train(
        model=model,
        train_loader=train_loader,
        val_loader=val_loader,
        device=device,
        epochs=args.epochs,
        lr=args.lr,
        weight_decay=args.weight_decay,
        scheduler_type=args.scheduler,
        patience=args.patience,
        use_amp=args.use_amp,
        mixup_alpha=args.mixup,
        label_smoothing=args.label_smoothing,
        resume_path=args.resume,
    )
    
    # Save history
    history_path = args.save_dir / f"training_history_{datetime.now():%Y%m%d_%H%M%S}.json"
    with open(history_path, "w") as f:
        json.dump(history, f, indent=2)
    print(f"[INFO] Training history saved to {history_path}")
    
    # Evaluate on test set
    print("\n" + "=" * 80)
    print("[INFO] Evaluating best model on test set...")
    print("=" * 80)
    
    # Load best model
    best_model_path = args.save_dir / "best_model.pth"
    if best_model_path.exists():
        checkpoint = torch.load(best_model_path, map_location=device)
        model.load_state_dict(checkpoint['model_state_dict'])
        print(f"[INFO] Loaded best model (val_acc={checkpoint['best_val_acc']:.4f})")
    
    # Evaluate
    criterion = nn.CrossEntropyLoss()
    test_loss, test_acc = evaluate(model, test_loader, criterion, device, args.use_amp)
    
    print("\n" + "=" * 80)
    print("FINAL RESULTS")
    print("=" * 80)
    print(f"Test Loss: {test_loss:.4f}")
    print(f"Test Accuracy: {test_acc:.4f} ({test_acc*100:.2f}%)")
    print(f"Best Model: {best_model_path}")
    print("=" * 80)
    
    # Save final model for inference
    final_model_path = args.save_dir / "facial_emotion_model_torch.pth"
    torch.save(model.state_dict(), final_model_path)
    print(f"[INFO] Final model saved to {final_model_path}")


if __name__ == "__main__":
    import sys
    try:
        main()
    except KeyboardInterrupt:
        print("\n[INFO] Training interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n[ERROR] Training failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
