# 💰 Spending Categorization with ML

This project implements an intelligent spending categorization system using Machine Learning. It automatically categorizes transactions into predefined categories like Groceries, Transport, Entertainment, etc.

## 🚀 Features

- 🤖 ML-powered transaction categorization
- 🔄 Real-time predictions
- 📊 Continuous learning from user feedback
- 🌐 REST API for easy integration
- 🎯 High accuracy with Random Forest classifier
- 📱 Ready for both backend and frontend integration

## 🛠️ Setup

### Backend Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

### Endpoints

1. **Predict Category**
   ```http
   POST /predict/
   ```
   Request body:
   ```json
   {
     "description": "Walmart groceries",
     "amount": 50.00,
     "merchant_name": "WALMART"
   }
   ```

2. **Train Model**
   ```http
   POST /train/
   ```
   Request body:
   ```json
   {
     "transactions": [
       {
         "description": "Walmart groceries",
         "amount": 50.00,
         "category": "Groceries"
       },
       {
         "description": "Uber ride",
         "amount": 15.00,
         "category": "Transport"
       }
     ]
   }
   ```

3. **Health Check**
   ```http
   GET /health/
   ```

## 🎯 Categories

The system currently supports these main categories:
- Groceries
- Transport
- Entertainment
- Food & Drink
- Shopping
- Housing
- Health & Fitness
- Bills & Utilities
- Travel
- Education

## 📈 Model Performance

The current implementation uses:
- TF-IDF vectorization for text features
- Random Forest classifier
- Cross-validation for model evaluation
- Regular retraining with user feedback

## 🔒 Security Considerations

1. In production:
   - Replace CORS `allow_origins=["*"]` with specific origins
   - Add authentication
   - Use HTTPS
   - Implement rate limiting

## 🚀 Next Steps

1. [ ] Add user authentication
2. [ ] Implement frontend dashboard
3. [ ] Add more sophisticated feature engineering
4. [ ] Integrate with banking APIs
5. [ ] Add export/import functionality

## 📝 License

MIT License 