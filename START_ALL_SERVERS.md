# 🚀 Start All Servers - Quick Guide

## Start Everything

### Option 1: Manual Start (Recommended)

**Terminal 1 - Text Sentiment API:**
```bash
cd "capstone project/empathic-mind-pal/ml"
python api_server.py
```
✅ Should show: "Model loaded successfully!" on port 8000

**Terminal 2 - Facial Emotion API:**
```bash
cd "capstone project/empathic-mind-pal/ml"
python facial_emotion_api.py
```
✅ Should show: "Facial emotion model loaded successfully!" on port 8001

**Terminal 3 - Frontend:**
```bash
cd "capstone project/empathic-mind-pal"
npm run dev
```
✅ Should start on http://localhost:5173

### Option 2: Windows Batch Script

Create `start_all.bat` in project root:
```batch
@echo off
start "Text Sentiment API" cmd /k "cd ml && python api_server.py"
timeout /t 3
start "Facial Emotion API" cmd /k "cd ml && python facial_emotion_api.py"
timeout /t 3
start "Frontend" cmd /k "npm run dev"
echo All servers starting...
pause
```

## Verify Everything is Running

1. **Text Sentiment API**: http://localhost:8000/health
   - Should return: `{"status":"healthy","model_loaded":true}`

2. **Facial Emotion API**: http://localhost:8001/health
   - Should return: `{"status":"healthy","model_loaded":true}`

3. **Frontend**: http://localhost:5173
   - Should show the application

## Access Your Application

- **Main App**: http://localhost:5173
- **Chat (Text Emotions)**: http://localhost:5173/chat
- **Facial Emotion**: http://localhost:5173/facial-emotion
- **Emotion Test**: http://localhost:5173/emotion-test
- **Dashboard**: http://localhost:5173/dashboard

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors:
```powershell
# Find and stop processes on ports 8000, 8001, 5173
Get-NetTCPConnection -LocalPort 8000,8001,5173 -ErrorAction SilentlyContinue | 
  Select-Object -ExpandProperty OwningProcess | 
  ForEach-Object { Stop-Process -Id $_ -Force }
```

### APIs Not Loading Models
- Check that model files exist:
  - `ml/checkpoints/best_model/` (text sentiment)
  - `ml/checkpoints/facial_emotion_model_torch.pth` (facial)
- Check API server console for error messages

### Frontend Can't Connect
- Verify APIs are running (check health endpoints)
- Check browser console for CORS errors
- Verify environment variables if using custom ports

## Quick Status Check

Run this PowerShell command to check all servers:
```powershell
Write-Host "Text API:" -NoNewline; try { Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 1 | Out-Null; Write-Host " ✅" -ForegroundColor Green } catch { Write-Host " ❌" -ForegroundColor Red }
Write-Host "Facial API:" -NoNewline; try { Invoke-WebRequest -Uri "http://localhost:8001/health" -UseBasicParsing -TimeoutSec 1 | Out-Null; Write-Host " ✅" -ForegroundColor Green } catch { Write-Host " ❌" -ForegroundColor Red }
Write-Host "Frontend:" -NoNewline; try { Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 1 | Out-Null; Write-Host " ✅" -ForegroundColor Green } catch { Write-Host " ❌" -ForegroundColor Red }
```

