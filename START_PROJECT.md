# Starting Your Empathic Mind Pal Project

## Quick Start

### 1. Start ML API Server

Open a terminal in the `ml` directory and run:
```bash
cd ml
python api_server.py
```

Wait for the message: "Model loaded successfully!" (this takes ~10-30 seconds)

The API will be available at: `http://localhost:8000`

### 2. Start Frontend

Open a **new terminal** in the project root and run:
```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173` (or another port if 5173 is taken)

### 3. Access the Application

Open your browser and go to: **http://localhost:5173**

## Features

- **Chat Interface**: Type messages to see emotion detection in action
- **ML-Powered**: Uses DistilBERT model for accurate emotion classification
- **Fallback**: Automatically falls back to keyword-based analysis if API is unavailable
- **Dashboard**: View mood trends and analytics

## Testing the ML Model

1. Go to the Chat page
2. Type messages like:
   - "I'm feeling great today!"
   - "I'm really anxious about the exam"
   - "That made me so angry!"
   - "I'm grateful for your support"

3. Watch as the ML model detects emotions and provides empathetic responses

## Troubleshooting

### API Server Not Starting
- Make sure you're in the `ml` directory
- Check that `checkpoints/best_model/` exists
- Verify Python dependencies are installed: `pip install -r requirements.txt`

### Frontend Can't Connect to API
- Verify API server is running on port 8000
- Check `.env` file exists with: `VITE_ML_API_URL=http://localhost:8000`
- Frontend will use fallback analysis if API is unavailable

### Port Already in Use
- Change API port in `ml/api_server.py` (line 110)
- Change frontend port in `vite.config.ts` or use the port shown in terminal

## Stopping Servers

- **API Server**: Press `Ctrl+C` in the terminal running the API
- **Frontend**: Press `Ctrl+C` in the terminal running `npm run dev`

