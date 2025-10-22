from flask import Flask, request, jsonify
import joblib
import re

app = Flask(__name__)

# Load the trained model
try:
    model_bundle = joblib.load('models/emotion_recognition_model.pkl')
except:
    # Fallback to baseline model if emotion_recognition_model.pkl doesn't exist
    model_bundle = joblib.load('models/baseline_model.pkl')

vectorizer = model_bundle['vectorizer']
classifier = model_bundle['model'] if 'model' in model_bundle else model_bundle['classifier']
classes = model_bundle['classes']

def clean_text(text):
    """Clean input text"""
    if not isinstance(text, str):
        return ''
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    text = re.sub(r"[^a-z0-9\s']", ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        # Clean and vectorize text
        cleaned_text = clean_text(text)
        text_vector = vectorizer.transform([cleaned_text])

        # Make prediction
        predicted_emotion = classifier.predict(text_vector)[0]
        probabilities = classifier.predict_proba(text_vector)[0]

        # Create response
        response = {
            'text': text,
            'predicted_emotion': predicted_emotion,
            'confidence': float(max(probabilities)),
            'probabilities': {emotion: float(prob) for emotion, prob in zip(classes, probabilities)}
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model_loaded': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
