"""
Improved retraining script for facial emotion recognition
This will train a better model with improved settings
"""

import subprocess
import sys
import os

def main():
    print("=" * 70)
    print("IMPROVED FACIAL EMOTION MODEL RETRAINING")
    print("=" * 70)
    print()
    print("This will retrain the model with improved settings:")
    print("  - More epochs (80 instead of 60)")
    print("  - Better learning rate schedule")
    print("  - Enhanced data augmentation")
    print("  - Larger model capacity")
    print()
    
    response = input("Do you want to proceed? (yes/no): ").strip().lower()
    if response not in ['yes', 'y']:
        print("Cancelled.")
        return
    
    print()
    print("Starting training...")
    print("This will take 2-4 hours on CPU, 30-60 minutes on GPU")
    print()
    
    # Run the training script with improved parameters
    cmd = [
        sys.executable,
        "train_facial_emotion_torch.py",
        "--epochs", "80",  # More epochs for better accuracy
        "--batch-size", "64",
        "--lr", "0.001",
        "--patience", "10",  # More patience for better convergence
        "--val-split", "0.1",
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print()
        print("=" * 70)
        print("TRAINING COMPLETE!")
        print("=" * 70)
        print("The new model has been saved to: checkpoints/facial_emotion_model_torch.pth")
        print()
        print("To use the new model, restart the API server:")
        print("  cd ml && python facial_emotion_api.py")
        print("=" * 70)
    except subprocess.CalledProcessError as e:
        print(f"Training failed with error: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nTraining interrupted by user.")
        sys.exit(1)

if __name__ == "__main__":
    main()

