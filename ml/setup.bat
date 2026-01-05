@echo off
REM Setup script for ML model training environment (Windows)

echo Setting up ML model training environment...

REM Create virtual environment
echo Creating Python virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create checkpoints directory
echo Creating checkpoints directory...
if not exist checkpoints mkdir checkpoints

echo Setup complete!
echo To activate the virtual environment, run: venv\Scripts\activate.bat
echo To train the model, run: python train_model.py
echo To start the API server, run: python api_server.py

pause

