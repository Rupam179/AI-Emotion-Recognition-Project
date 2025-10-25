// AI Emotion Recognition - Interactive Demo
document.addEventListener('DOMContentLoaded', function() {
    
    // Emotion detection simulation
    const emotionData = {
        'joy': { icon: '😊', keywords: ['happy', 'excited', 'wonderful', 'fantastic', 'amazing', 'love', 'great', 'awesome'] },
        'anger': { icon: '😠', keywords: ['angry', 'furious', 'mad', 'hate', 'worst', 'terrible', 'awful', 'frustrated'] },
        'sadness': { icon: '😢', keywords: ['sad', 'depressed', 'cry', 'lonely', 'heartbroken', 'devastated', 'hopeless'] },
        'fear': { icon: '😨', keywords: ['scared', 'afraid', 'terrified', 'worried', 'anxious', 'nervous', 'frightened'] },
        'surprise': { icon: '😲', keywords: ['surprised', 'shocked', 'unexpected', 'amazing', 'wow', 'incredible'] },
        'disgust': { icon: '🤢', keywords: ['disgusting', 'awful', 'terrible', 'horrible', 'gross', 'appalled'] },
        'neutral': { icon: '😐', keywords: ['okay', 'fine', 'normal', 'regular', 'standard', 'average'] }
    };

    // Sample texts for demo
    const sampleTexts = [
        "I am so happy and excited about this project!",
        "This is absolutely terrible and makes me furious!",
        "I feel so sad and lonely today.",
        "I'm really scared about the upcoming presentation.",
        "Wow, that was completely unexpected!",
        "This situation is absolutely disgusting.",
        "The weather is okay today, nothing special."
    ];

    // DOM elements
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const detectedEmotion = document.getElementById('detectedEmotion');
    const confidence = document.getElementById('confidence');
    const emotionIcon = document.querySelector('.emotion-icon');
    const emotionBars = document.querySelector('.emotion-bars');

    // Analyze emotion function
    function analyzeEmotion(text) {
        const lowerText = text.toLowerCase();
        const scores = {};
        
        // Initialize scores
        Object.keys(emotionData).forEach(emotion => {
            scores[emotion] = 0;
        });

        // Calculate scores based on keywords
        Object.keys(emotionData).forEach(emotion => {
            emotionData[emotion].keywords.forEach(keyword => {
                if (lowerText.includes(keyword)) {
                    scores[emotion] += 1;
                }
            });
        });

        // Add some randomness for more realistic demo
        Object.keys(scores).forEach(emotion => {
            scores[emotion] += Math.random() * 0.3;
        });

        // Find the emotion with highest score
        let maxEmotion = 'neutral';
        let maxScore = scores.neutral;
        
        Object.keys(scores).forEach(emotion => {
            if (scores[emotion] > maxScore) {
                maxScore = scores[emotion];
                maxEmotion = emotion;
            }
        });

        // Calculate percentages
        const total = Object.values(scores).reduce((a, b) => a + b, 0);
        const percentages = {};
        Object.keys(scores).forEach(emotion => {
            percentages[emotion] = Math.round((scores[emotion] / total) * 100);
        });

        // Ensure the top emotion has at least 60% confidence
        if (percentages[maxEmotion] < 60) {
            percentages[maxEmotion] = 60 + Math.floor(Math.random() * 30);
            // Redistribute remaining percentages
            const remaining = 100 - percentages[maxEmotion];
            const otherEmotions = Object.keys(percentages).filter(e => e !== maxEmotion);
            otherEmotions.forEach((emotion, index) => {
                if (index === otherEmotions.length - 1) {
                    percentages[emotion] = remaining - otherEmotions.slice(0, -1).reduce((sum, e) => sum + percentages[e], 0);
                } else {
                    percentages[emotion] = Math.floor(Math.random() * (remaining / otherEmotions.length));
                }
            });
        }

        return { emotion: maxEmotion, percentages };
    }

    // Update UI with results
    function updateResults(result) {
        const { emotion, percentages } = result;
        
        // Update main result
        detectedEmotion.textContent = emotion.charAt(0).toUpperCase() + emotion.slice(1);
        confidence.textContent = `Confidence: ${percentages[emotion]}%`;
        emotionIcon.textContent = emotionData[emotion].icon;

        // Update emotion bars
        emotionBars.innerHTML = '';
        
        // Sort emotions by percentage
        const sortedEmotions = Object.keys(percentages).sort((a, b) => percentages[b] - percentages[a]);
        
        // Show top 3 emotions
        sortedEmotions.slice(0, 3).forEach(emotion => {
            const bar = document.createElement('div');
            bar.className = 'emotion-bar';
            bar.innerHTML = `
                <span>${emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                <div class="bar"><div class="fill" style="width: ${percentages[emotion]}%"></div></div>
                <span>${percentages[emotion]}%</span>
            `;
            emotionBars.appendChild(bar);
        });

        // Add animation
        setTimeout(() => {
            document.querySelectorAll('.fill').forEach(fill => {
                fill.style.transition = 'width 1s ease-in-out';
            });
        }, 100);
    }

    // Analyze button click handler
    analyzeBtn.addEventListener('click', function() {
        const text = textInput.value.trim();
        
        if (!text) {
            alert('Please enter some text to analyze!');
            return;
        }

        // Add loading state
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        analyzeBtn.disabled = true;

        // Simulate API delay
        setTimeout(() => {
            const result = analyzeEmotion(text);
            updateResults(result);
            
            // Reset button
            analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Emotion';
            analyzeBtn.disabled = false;
        }, 1500);
    });

    // Sample text rotation
    let currentSampleIndex = 0;
    function rotateSampleText() {
        if (textInput.value === textInput.placeholder || textInput.value === '') {
            textInput.placeholder = sampleTexts[currentSampleIndex];
            currentSampleIndex = (currentSampleIndex + 1) % sampleTexts.length;
        }
    }

    // Rotate sample text every 5 seconds
    setInterval(rotateSampleText, 5000);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(102, 126, 234, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            header.style.backdropFilter = 'none';
        }
    });

    // Initialize with default analysis
    const defaultResult = analyzeEmotion(textInput.value);
    updateResults(defaultResult);
});