import sys
import joblib
import json

# Load model
model = joblib.load("C:\\Users\\Sarvadnya\\Desktop\\learning\\College-Management-System\\backend\\python\\cgpa_model.pkl")

# Read features from input
features = json.loads(sys.argv[1])

# Validate input
if len(features) == 0 or not all(isinstance(f, (int, float)) for f in features):
    raise ValueError("Invalid features provided for prediction.")

# Make prediction
prediction = model.predict([features])

# Output the prediction
print(prediction[0])  # CGPA prediction result
