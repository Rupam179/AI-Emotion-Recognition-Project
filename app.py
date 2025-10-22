from flask import Flask, request, jsonify
import joblib
import re

app = Flask(__name__)

# Load the trained model with error handling
model_bundle = None
vectorizer = None
classifier = None
classes = None

def load_model():
    global model_bundle, vectorizer, classifier, classes
    if model_bundle is None:
        try:
            model_bundle = joblib.load('models/baseline_model.pkl')
            vectorizer = model_bundle['vectorizer']
            classifier = model_bundle['model'] if 'model' in model_bundle else model_bundle['classifier']
            classes = model_bundle['classes']
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    return True

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
        # Load model if not already loaded
        if not load_model():
            return jsonify({'error': 'Model not available'}), 500
            
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
    model_status = load_model()
    return jsonify({
        'status': 'healthy' if model_status else 'model_error', 
        'model_loaded': model_status
    })

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
