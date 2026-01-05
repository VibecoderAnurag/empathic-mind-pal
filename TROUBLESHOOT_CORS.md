# Troubleshooting CORS Issues

## Problem
The frontend shows "API Server Offline" even though the API server is running.

## Solution
The CORS configuration has been updated to allow all localhost ports. Here's what to do:

### Step 1: Verify API Server is Running
1. Open your browser
2. Go to: `http://localhost:8000/health`
3. You should see: `{"status":"healthy","model_loaded":true}`

### Step 2: Check Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Look for any CORS errors or network errors
4. Check the Network tab to see if requests are being blocked

### Step 3: Verify Frontend Port
1. Check what port your frontend is running on
2. Look at the terminal where you ran `npm run dev`
3. It should show something like: `Local: http://localhost:5173`

### Step 4: Test API from Browser Console
Open your browser console and run:
```javascript
fetch('http://localhost:8000/health')
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

### Step 5: Restart API Server
If the server is already running, restart it to apply the new CORS configuration:
1. Stop the server (Ctrl+C)
2. Start it again: `python api_server.py`

### Step 6: Refresh Frontend
1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check if the API status updates

## Common Issues

### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solution**: 
- Make sure the API server is running with the updated CORS configuration
- Restart the API server
- Check that the frontend URL matches the CORS pattern

### Issue: "Network error" or "Failed to fetch"
**Solution**:
- Verify the API server is running: `http://localhost:8000/health`
- Check that port 8000 is not blocked by firewall
- Verify the API URL in the frontend: `VITE_ML_API_URL=http://localhost:8000`

### Issue: "OPTIONS request failed"
**Solution**:
- The CORS middleware should handle OPTIONS requests automatically
- Make sure the server is using the updated CORS configuration
- Check that `allow_methods=["*"]` is set in the CORS middleware

## Updated CORS Configuration

The API server now uses:
```python
allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+"
```

This allows any localhost port, so it should work regardless of which port your frontend is running on.

## Testing

### Test 1: Direct API Call
```bash
curl http://localhost:8000/health
```

### Test 2: Test from Browser
Open browser console and run:
```javascript
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log);
```

### Test 3: Test Prediction
```javascript
fetch('http://localhost:8000/predict', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({text: 'I am happy', top_k: 5})
})
  .then(r => r.json())
  .then(console.log);
```

## If Still Not Working

1. **Check browser console** for specific error messages
2. **Verify API server logs** for any errors
3. **Check network tab** in browser DevTools to see the actual request/response
4. **Try a different browser** to rule out browser-specific issues
5. **Clear browser cache** and hard refresh

## Notes

- The CORS configuration allows all localhost ports for development
- For production, you should restrict to specific origins
- The API server must be restarted for CORS changes to take effect
- Browser may cache CORS responses, so try hard refresh if issues persist

