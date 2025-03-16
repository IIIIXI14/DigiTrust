import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from typing import Dict, Any, List

class SpendingCategorizationModel:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.model = MultinomialNB()
        self.categories = [
            'Shopping', 'Groceries', 'Transportation', 'Entertainment',
            'Utilities', 'Healthcare', 'Dining', 'Travel', 'Other'
        ]
        self.load_model()

    def load_model(self):
        try:
            # Load the model from your existing spending categorization backend
            # This is a placeholder - you'll need to properly load your model
            # self.model = joblib.load('path_to_your_model')
            pass
        except Exception as e:
            print(f"Error loading spending categorization model: {e}")

    def preprocess_transaction(self, transaction_data: Dict[str, Any]) -> str:
        # Combine relevant transaction information for categorization
        description = transaction_data.get('description', '')
        merchant = transaction_data.get('merchant', '')
        return f"{description} {merchant}".lower()

    def predict_category(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            # Preprocess the transaction
            text = self.preprocess_transaction(transaction_data)
            
            # For demonstration, using a simple rule-based approach
            # Replace this with your actual model prediction
            keywords = {
                'Shopping': ['amazon', 'walmart', 'target', 'store'],
                'Groceries': ['grocery', 'food', 'market'],
                'Transportation': ['uber', 'lyft', 'taxi', 'gas'],
                'Entertainment': ['netflix', 'spotify', 'movie'],
                'Utilities': ['electric', 'water', 'internet'],
                'Healthcare': ['hospital', 'doctor', 'pharmacy'],
                'Dining': ['restaurant', 'cafe', 'coffee'],
                'Travel': ['hotel', 'flight', 'airbnb']
            }
            
            # Simple keyword matching (replace with actual model prediction)
            for category, words in keywords.items():
                if any(word in text for word in words):
                    return {
                        "category": category,
                        "confidence": 0.85,
                        "alternative_categories": ["Other"]
                    }
            
            return {
                "category": "Other",
                "confidence": 0.6,
                "alternative_categories": []
            }
        except Exception as e:
            print(f"Error in category prediction: {e}")
            return {
                "error": str(e),
                "category": "Other",
                "confidence": 0.0,
                "alternative_categories": []
            }

    def get_spending_insights(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        try:
            # Categorize all transactions
            categorized = []
            for transaction in transactions:
                result = self.predict_category(transaction)
                categorized.append({
                    **transaction,
                    "category": result["category"]
                })
            
            # Convert to DataFrame for analysis
            df = pd.DataFrame(categorized)
            
            # Calculate insights
            category_totals = df.groupby('category')['amount'].sum().to_dict()
            category_counts = df.groupby('category').size().to_dict()
            
            return {
                "category_totals": category_totals,
                "category_counts": category_counts,
                "total_spending": sum(category_totals.values()),
                "transaction_count": len(transactions)
            }
        except Exception as e:
            print(f"Error generating spending insights: {e}")
            return {
                "error": str(e),
                "category_totals": {},
                "category_counts": {},
                "total_spending": 0,
                "transaction_count": 0
            } 