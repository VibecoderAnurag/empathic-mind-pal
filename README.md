# Empathic Mind Pal 🧠💙

A comprehensive mental health support application that combines AI-driven emotional intelligence with practical wellness tools. Empathic Mind Pal helps users track their moods, receive real-time emotional support, and practice mindfulness through an adaptive, empathetic interface.

## 🌟 Key Features

### 🤖 AI-Powered Support
- **Empathetic Chatbot**: Engage in meaningful conversations with an AI trained to understand and respond to your emotional state.
- **Emotion Recognition**:
  - **Text Analysis**: Uses DistilBERT (fine-tuned on GoEmotions) to detect nuances in your text.
  - **Facial Expression**: Real-time facial emotion detection using computer vision to gauge your mood via camera.

### 🧘 Wellness Toolkit
- **Breathing Exercises**: Guided interactive breathing sessions to reduce anxiety.
- **Gratitude Journaling**: Dedicated space for gratitude reflection.
- **Positive Memory Recall**: Tools to help anchor positive experiences.
- **Wellness Routines**: Customizable routines to build healthy mental habits.

### 🎨 Adaptive Experience
- **Dynamic Themes**: The UI theme adapts to your current emotion (e.g., calming blues for anxiety, warm tones for happiness).
- **Personalized Suggestions**: Smart recommendations for interventions based on your detected mood.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn-ui
- **State/Routing**: TanStack Query, React Router
- **Animations**: Framer Motion

### Machine Learning & Backend
- **API**: FastAPI (Python)
- **Deep Learning**: PyTorch, TensorFlow, TensorFlow.js
- **NLP**: Hugging Face Transformers (DistilBERT), VADER Sentiment, TextBlob
- **Computer Vision**: Custom CNN models for FER (Facial Emotion Recognition)

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (3.9+ recommended)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VibecoderAnurag/empathic-mind-pal.git
   cd empathic-mind-pal
   ```

2. **Frontend Setup**
   ```bash
   npm install
   ```

3. **ML/Backend Setup**
   Navigate to the `ml` directory and set up the Python environment.
   ```bash
   cd ml
   # Windows
   setup.bat
   # Linux/Mac
   bash setup.sh
   ```
   *Alternatively, manually install dependencies:*
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

You can start the entire application (Frontend + Backend) using the provided scripts in the root directory.

**Windows:**
```bash
start_project.bat
```

**Manual Start:**

1. **Start the Backend API:**
   ```bash
   cd ml
   python api_server.py
   ```
   *Server runs on http://localhost:8000*

2. **Start the Frontend:**
   ```bash
   # In a new terminal, from the root directory
   npm run dev
   ```
   *App runs on http://localhost:8080 (or similar)*

## 📂 Project Structure

```
empathic-mind-pal/
├── src/                # Frontend Source
│   ├── components/     # UI Components (Chat, Cards, etc.)
│   ├── pages/          # Application Routes (Dashboard, Chat, etc.)
│   └── utils/          # Helper functions & API clients
├── ml/                 # Machine Learning Backend
│   ├── models/         # Saved model files
│   ├── services/       # Business logic (Music, Affirmations, etc.)
│   ├── api_server.py   # FastAPI entry point
│   └── train_model.py  # Training scripts
└── public/             # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with 💙 by [Anurag](https://github.com/VibecoderAnurag)
