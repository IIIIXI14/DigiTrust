import tensorflow as tf
import numpy as np
from typing import Dict, Any
import json

class FraudDetectionModel:
    def __init__(self):
        # Initialize model parameters
        self.model = None
        self.load_model()

    def load_model(self):
        try:
            # Load the model architecture from the JS file and convert it to a TF model
            # This is a placeholder - you'll need to properly convert your JS model
            self.model = tf.keras.Sequential([
                tf.keras.layers.Dense(64, activation='relu', input_shape=(30,)),
                tf.keras.layers.Dense(32, activation='relu'),
                tf.keras.layers.Dense(1, activation='sigmoid')
            ])
            self.model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        except Exception as e:
            print(f"Error loading fraud detection model: {e}")

    def preprocess_transaction(self, transaction_data: Dict[str, Any]) -> np.ndarray:
        # Convert transaction data into the format expected by the model
        # This should match your original JS preprocessing
        features = []
        for key in ['amount', 'time', 'location', 'merchant']:  # Add all relevant features
            features.append(float(transaction_data.get(key, 0)))
        return np.array(features).reshape(1, -1)

    def predict(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            # Preprocess the transaction data
            processed_data = self.preprocess_transaction(transaction_data)
            
            # Make prediction
            prediction = self.model.predict(processed_data)
            
            # Convert prediction to risk score
            risk_score = float(prediction[0][0])
            
            return {
                "is_fraudulent": risk_score > 0.5,
                "risk_score": risk_score,
                "confidence": abs(risk_score - 0.5) * 2  # Scale confidence between 0 and 1
            }
        except Exception as e:
            print(f"Error in fraud prediction: {e}")
            return {
                "error": str(e),
                "is_fraudulent": False,
                "risk_score": 0.0,
                "confidence": 0.0
            } 