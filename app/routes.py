from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from models.fraud_detection import FraudDetectionModel
from models.spending_categorization import SpendingCategorizationModel
from models.chatbot import BankingChatbot

# Initialize router
router = APIRouter()

# Initialize models
fraud_model = FraudDetectionModel()
spending_model = SpendingCategorizationModel()
chatbot = BankingChatbot()

# Fraud Detection Routes
@router.post("/fraud/detect", tags=["Fraud Detection"])
async def detect_fraud(transaction: Dict[str, Any]):
    """
    Detect potential fraud in a transaction using the AI model.
    """
    try:
        result = fraud_model.predict(transaction)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Spending Categorization Routes
@router.post("/spending/categorize", tags=["Spending Categorization"])
async def categorize_transaction(transaction: Dict[str, Any]):
    """
    Categorize a single transaction using the AI model.
    """
    try:
        result = spending_model.predict_category(transaction)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/spending/insights", tags=["Spending Categorization"])
async def get_spending_insights(transactions: List[Dict[str, Any]]):
    """
    Generate spending insights from a list of transactions.
    """
    try:
        result = spending_model.get_spending_insights(transactions)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Chatbot Routes
@router.post("/chat/message", tags=["Chatbot"])
async def process_chat_message(request: Dict[str, Any]):
    """
    Process a chat message and generate a response.
    """
    try:
        message = request.get("message")
        user_context = request.get("context", {})
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        result = chatbot.generate_response(message, user_context)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health Check Route
@router.get("/health", tags=["Health"])
async def health_check():
    """
    Check the health status of all models.
    """
    return {
        "status": "healthy",
        "models": {
            "fraud_detection": fraud_model is not None,
            "spending_categorization": spending_model is not None,
            "chatbot": chatbot is not None
        }
    } 