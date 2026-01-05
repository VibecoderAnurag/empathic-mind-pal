#!/bin/bash
# Setup script for ML model training environment

echo "Setting up ML model training environment..."

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create checkpoints directory
echo "Creating checkpoints directory..."
mkdir -p checkpoints

echo "Setup complete!"
echo "To activate the virtual environment, run: source venv/bin/activate"
echo "To train the model, run: python train_model.py"
echo "To start the API server, run: python api_server.py"

