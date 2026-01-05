# Project Structure

This document outlines the structure of the Empathic Mind Pal project.

## Directory Layout

```
empathic-mind-pal/
├── docs/               # Project documentation
│   ├── ML_GUIDE.md     # Machine Learning model documentation
│   └── PROJECT_STRUCTURE.md
├── ml/                 # Machine Learning components
│   ├── api_server.py   # FastAPI backend for emotion prediction
│   ├── train_model.py  # Training script for the model
│   └── ...
├── src/                # Frontend Source Code (React + TypeScript)
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages (Chat, Index, NotFound)
│   ├── utils/          # Utility functions and logic
│   │   ├── responseEngine.ts  # Unified emotion response logic
│   │   ├── emotions.ts        # Emotion definitions
│   │   └── ...
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── index.html          # HTML entry point
├── package.json        # Node.js dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite build configuration
└── README.md           # Main project entry point
```

## Key Components

### Frontend (src/)
- **Pages**:
  - `Chat.tsx`: The main chat interface where users interact with the AI.
  - `Index.tsx`: The landing page.
- **Utils**:
  - `responseEngine.ts`: Contains the logic for generating empathetic responses based on detected emotions (supports 28 GoEmotions).
  - `mlEmotionApi.ts`: Handles communication with the Python ML backend.

### Backend (ml/)
- **API Server**: `api_server.py` runs a FastAPI server to serve the emotion classification model.
- **Model**: Uses a fine-tuned DistilBERT model for text-based emotion detection.

## Development

- **Frontend**: Run `npm run dev` to start the Vite development server.
- **Backend**: Run `python ml/api_server.py` to start the emotion prediction API.
