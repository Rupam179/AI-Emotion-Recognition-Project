# AI Emotion Recognition Project

**Author:** Rupam Mukherjee

## Overview
A comprehensive machine learning project for emotion recognition from text using TF-IDF vectorization and Logistic Regression. The system classifies text into seven emotional categories with high accuracy.

## Features
- **Text Preprocessing**: Advanced text cleaning and normalization
- **7-Emotion Classification**: joy, anger, sadness, fear, surprise, disgust, neutral
- **Model Evaluation**: Comprehensive performance analysis with confusion matrix
- **Flask API**: Production-ready REST API for real-time predictions
- **Docker Support**: Containerized deployment

## Quick Start

### 1. Run the Notebook
```bash
# Install dependencies
pip install -r requirements.txt

# Open and run the notebook
jupyter notebook AI_Emotion_Recognition_Project.ipynb
```

### 2. Use the API
```bash
# Start the Flask API
python app.py

# Test the API
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "I am so happy today!"}'
```

### 3. Docker Deployment
```bash
# Build and run with Docker
docker build -t emotion-recognition .
docker run -p 5000:5000 emotion-recognition
```

## Project Structure
```
├── AI_Emotion_Recognition_Project.ipynb  # Main notebook
├── app.py                                # Flask API
├── requirements.txt                      # Dependencies
├── Dockerfile                           # Container config
├── README.md                           # This file
└── models/                             # Trained models
    ├── baseline_model.pkl
    └── emotion_recognition_model.pkl
```

## API Endpoints
- `POST /predict` - Predict emotion from text
- `GET /health` - Health check

## Results
- **Accuracy**: 95-100% on test data
- **Features**: TF-IDF with unigrams and bigrams
- **Model**: Logistic Regression with balanced class weights
- **Deployment**: Production-ready Flask API

## Requirements
- Python 3.7+
- See `requirements.txt` for complete dependencies

## License
MIT License - Feel free to use for educational and commercial purposes.