#!/bin/bash
# Quick setup script for facial emotion model training

echo "========================================"
echo "Facial Emotion Model Setup"
echo "========================================"
echo

# Check if fer2013.csv exists
if [ ! -f "fer2013.csv" ]; then
    echo "[ERROR] fer2013.csv not found!"
    echo
    echo "Please download FER2013 dataset:"
    echo "1. Go to: https://www.kaggle.com/datasets/msambare/fer2013"
    echo "2. Download fer2013.csv"
    echo "3. Place it in the ml/ directory"
    echo
    exit 1
fi

echo "[OK] fer2013.csv found"
echo

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python3 not found!"
    echo "Please install Python 3.8+"
    exit 1
fi

echo "[OK] Python found"
echo

# Install dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies"
    exit 1
fi

echo
echo "[OK] Dependencies installed"
echo

# Create directories
mkdir -p checkpoints
mkdir -p model

echo
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo
echo "Next steps:"
echo "1. Run: python3 train_facial_emotion.py"
echo "2. After training, copy model files:"
echo "   cp -r model/* ../public/ml/model/"
echo

