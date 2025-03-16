import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import joblib
from typing import Tuple, Dict, List
import os

class TransactionCategorizer:
    def __init__(self):
        self.model_pipeline = None
        self.categories = None
        self.model_path = "models/spending_categorizer.pkl"

    def preprocess_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Preprocess the transaction data for training
        """
        # Combine description and merchant name if available
        if 'merchant_name' in df.columns:
            df['description'] = df['merchant_name'] + ' ' + df['description']

        # Convert amount to float and handle any currency symbols
        if 'amount' in df.columns:
            df['amount'] = df['amount'].astype(str).str.replace('$', '').str.replace(',', '').astype(float)

        # Store unique categories
        self.categories = df['category'].unique()
        
        return df[['description', 'amount']], df['category']

    def train(self, training_data: Dict[str, List]) -> None:
        """
        Train the model on the provided data
        """
        # Convert training data to DataFrame
        df = pd.DataFrame(training_data)
        
        # Preprocess data
        X, y = self.preprocess_data(df)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Create pipeline with TF-IDF and Random Forest
        self.model_pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(
                max_features=5000,
                ngram_range=(1, 2),
                stop_words='english'
            )),
            ('classifier', RandomForestClassifier(
                n_estimators=100,
                random_state=42,
                n_jobs=-1
            ))
        ])

        # Train the model
        self.model_pipeline.fit(X_train['description'], y_train)
        
        # Save the model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model_pipeline, self.model_path)

        # Calculate and print accuracy
        accuracy = self.model_pipeline.score(X_test['description'], y_test)
        print(f"Model accuracy: {accuracy:.2f}")

    def predict(self, description: str, amount: float = None) -> str:
        """
        Predict category for a new transaction
        """
        if self.model_pipeline is None:
            if os.path.exists(self.model_path):
                self.model_pipeline = joblib.load(self.model_path)
            else:
                raise ValueError("Model not trained yet!")

        prediction = self.model_pipeline.predict([description])[0]
        return prediction

    def load_model(self) -> None:
        """
        Load a previously saved model
        """
        if os.path.exists(self.model_path):
            self.model_pipeline = joblib.load(self.model_path)
        else:
            raise FileNotFoundError("No saved model found!")

# Example usage
if __name__ == "__main__":
    # Sample data
    sample_data = {
        "description": [
            "Walmart groceries",
            "Uber ride to work",
            "Netflix monthly subscription",
            "Starbucks coffee",
            "Apple Store purchase",
            "Monthly rent payment",
            "Amazon.com electronics",
            "Gas station fill up",
            "Restaurant dinner",
            "Gym membership"
        ],
        "amount": [150.50, 25.00, 14.99, 5.75, 999.99, 1500.00, 299.99, 45.00, 85.50, 50.00],
        "category": [
            "Groceries",
            "Transport",
            "Entertainment",
            "Food & Drink",
            "Shopping",
            "Housing",
            "Shopping",
            "Transport",
            "Food & Drink",
            "Health & Fitness"
        ]
    }

    # Initialize and train model
    categorizer = TransactionCategorizer()
    categorizer.train(sample_data)

    # Test prediction
    test_description = "McDonald's lunch"
    predicted_category = categorizer.predict(test_description)
    print(f"Predicted category for '{test_description}': {predicted_category}") 