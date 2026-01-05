# Download FER2013 Dataset

## Quick Download Guide

The FER2013 dataset is required to train the facial emotion detection model.

### Option 1: Kaggle (Recommended)

1. **Create a Kaggle account** (free): https://www.kaggle.com/account/login

2. **Download the dataset:**
   - Visit: https://www.kaggle.com/datasets/msambare/fer2013
   - Click the "Download" button (top right)
   - The file `fer2013.zip` will be downloaded

3. **Extract and place:**
   - Extract `fer2013.csv` from the zip file
   - Place `fer2013.csv` in the `ml/` directory
   - File size: ~87 MB

### Option 2: Kaggle API

If you have Kaggle API set up:

```bash
kaggle datasets download -d msambare/fer2013
unzip fer2013.zip
mv fer2013.csv ml/
```

### Option 3: Alternative Sources

Search for "FER2013 dataset download" - ensure you get the CSV format with these columns:
- `emotion` (0-6: angry, disgust, fear, happy, sad, surprise, neutral)
- `pixels` (space-separated pixel values)
- `Usage` (Training, PublicTest, PrivateTest)

## Verify Download

After downloading, verify the file:

```bash
# Check file exists
ls -lh ml/fer2013.csv

# Check first few lines (should see emotion, pixels, Usage columns)
head -n 5 ml/fer2013.csv
```

## Dataset Info

- **Total images:** 35,887
- **Training:** 28,709 images
- **Validation:** 3,589 images
- **Test:** 3,589 images
- **Image size:** 48x48 grayscale
- **Emotions:** 7 classes (angry, disgust, fear, happy, sad, surprise, neutral)
- **File format:** CSV with pixel values as space-separated strings

## After Download

Once `fer2013.csv` is in the `ml/` directory, you can start training:

```bash
cd ml
python train_facial_emotion.py
```

## Troubleshooting

### "Permission Denied" on Kaggle
- Make sure you're logged into Kaggle
- Accept the dataset terms and conditions
- Try downloading from the dataset page directly

### File Not Found After Download
- Verify the file is named exactly `fer2013.csv` (case-sensitive)
- Check it's in the `ml/` directory (not a subdirectory)
- Verify file size is ~87 MB

### Download is Slow
- The file is ~87 MB, so it may take a few minutes
- Try during off-peak hours
- Use a stable internet connection

