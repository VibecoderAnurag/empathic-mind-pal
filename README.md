# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e5667e1f-8615-4f20-b97e-673cc30e77f8

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e5667e1f-8615-4f20-b97e-673cc30e77f8) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- **ML Backend**: DistilBERT (Hugging Face Transformers) fine-tuned on GoEmotions dataset
- **API**: FastAPI for serving ML predictions

## Machine Learning Model

This project includes a DistilBERT-based emotion classification model fine-tuned on the GoEmotions dataset.

### ML Setup

1. **Navigate to ML directory:**
   ```bash
   cd ml
   ```

2. **Set up Python environment:**
   - **Windows**: Run `setup.bat`
   - **Linux/Mac**: Run `bash setup.sh`
   - Or manually:
     ```bash
     python -m venv venv
     source venv/bin/activate  # Linux/Mac
     # or
     venv\Scripts\activate  # Windows
     pip install -r requirements.txt
     ```

3. **Train the model:**
   ```bash
   python train_model.py
   ```
   This will:
   - Download and process the GoEmotions dataset
   - Fine-tune DistilBERT for emotion classification
   - Save the best model checkpoint with early stopping
   - Evaluate on test set

4. **Start the API server:**
   ```bash
   python api_server.py
   ```
   The API will be available at `http://localhost:8000`

5. **Update frontend environment:**
   Create a `.env` file in the root directory:
   ```env
   VITE_ML_API_URL=http://localhost:8000
   ```

See `ml/README.md` for detailed ML documentation.

## Facial Emotion Detection

The project now includes real-time facial emotion detection using TensorFlow.js!

### Quick Setup

1. **Install Python dependencies:**
   ```bash
   cd ml
   pip install -r requirements.txt
   ```

2. **Download FER2013 dataset:**
   - Visit: https://www.kaggle.com/datasets/msambare/fer2013
   - Download `fer2013.csv` to `ml/` directory

3. **Train the model:**
   ```bash
   cd ml
   python train_facial_emotion.py
   ```

4. **Copy model to public directory:**
   ```bash
   # Windows
   xcopy /E /I ml\model\* public\ml\model\
   
   # Linux/Mac
   cp -r ml/model/* public/ml/model/
   ```

5. **Test it:**
   - Navigate to: `http://localhost:8080/facial-emotion`
   - Click "Start Camera" and make expressions!

See `SETUP_FACIAL_EMOTION.md` and `ml/FACIAL_EMOTION_README.md` for detailed instructions.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e5667e1f-8615-4f20-b97e-673cc30e77f8) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
