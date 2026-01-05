# How to Start the ML API Server

## Quick Start

### Windows
1. Navigate to the `ml` directory
2. Double-click `start_api_server.bat`
   OR
   Open a terminal and run:
   ```bash
   cd ml
   python api_server.py
   ```

### Linux/Mac
1. Navigate to the `ml` directory
2. Run:
   ```bash
   cd ml
   chmod +x start_api_server.sh
   ./start_api_server.sh
   ```
   OR
   ```bash
   cd ml
   python api_server.py
   ```

## Verify Server is Running

1. Open your browser
2. Go to: `http://localhost:8000/health`
3. You should see: `{"status":"healthy","model_loaded":true}`

## Test the API

You can test the API with curl or PowerShell:

### PowerShell
```powershell
$body = @{text="I am happy"; top_k=5} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8000/predict" -Method POST -Body $body -ContentType "application/json"
```

### curl
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"I am happy","top_k":5}'
```

## Troubleshooting

### Port 8000 is already in use
- Stop any other service using port 8000
- Or change the port in `api_server.py` (line 137)

### Model not loading
- Check that `checkpoints/best_model/` exists
- Check that `checkpoints/label_mappings.json` exists
- Verify the model was trained successfully

### Dependencies not installed
```bash
cd ml
pip install -r requirements.txt
```

### Server won't start
- Check Python version: `python --version` (requires Python 3.8+)
- Check for errors in the terminal output
- Verify all required files exist

## Using the Frontend

Once the server is running:
1. Open your frontend application
2. Go to the Emotion Test page
3. You should see "API Server Online" alert
4. Start testing emotions!

## Stopping the Server

- Press `Ctrl+C` in the terminal where the server is running
- Or close the terminal window

## Notes

- The server must be running for the Emotion Test feature to work
- The server runs on `http://localhost:8000` by default
- The server will automatically load the model on startup
- Check the terminal output for any errors or warnings

