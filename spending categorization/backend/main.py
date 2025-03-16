from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from ml.model import TransactionCategorizer
import os

app = FastAPI(title="Spending Categorization API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the categorizer
categorizer = TransactionCategorizer()

# Load the model if it exists
try:
    categorizer.load_model()
except FileNotFoundError:
    # Model will be trained when first training data is received
    pass

class Transaction(BaseModel):
    description: str
    amount: Optional[float] = None
    merchant_name: Optional[str] = None

class TrainingData(BaseModel):
    transactions: List[Dict]

@app.post("/predict/")
async def predict_category(transaction: Transaction):
    """
    Predict category for a single transaction
    """
    try:
        category = categorizer.predict(
            description=transaction.description,
            amount=transaction.amount
        )
        return {"category": category}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train/")
async def train_model(data: TrainingData):
    """
    Train the model with new data
    """
    try:
        categorizer.train(data.transactions)
        return {"message": "Model trained successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health/")
async def health_check():
    """
    Check if the service is running
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 