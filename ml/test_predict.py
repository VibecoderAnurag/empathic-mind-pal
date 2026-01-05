"""Test script to check the predict endpoint"""
import requests
from io import BytesIO
from PIL import Image

# Create a test image
img = Image.new('RGB', (100, 100), color='red')
buf = BytesIO()
img.save(buf, format='JPEG')
buf.seek(0)

files = {'file': ('test.jpg', buf, 'image/jpeg')}

try:
    r = requests.post('http://localhost:8001/predict', files=files, timeout=10)
    print(f'Status: {r.status_code}')
    if r.status_code == 200:
        print('Response:', r.json())
    else:
        print('Error Response:', r.text[:500])
except Exception as e:
    print(f'Error: {e}')

