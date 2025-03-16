from sqlalchemy.orm import Session
from models.database_models import User, Account, Transaction, ChatSession, ChatMessage
from typing import List, Optional, Dict, Any
from datetime import datetime

# User operations
def create_user(db: Session, email: str, hashed_password: str, full_name: str) -> User:
    db_user = User(
        email=email,
        hashed_password=hashed_password,
        full_name=full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

# Account operations
def create_account(db: Session, user_id: int, account_type: str, account_number: str) -> Account:
    db_account = Account(
        user_id=user_id,
        account_type=account_type,
        account_number=account_number
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def get_user_accounts(db: Session, user_id: int) -> List[Account]:
    return db.query(Account).filter(Account.user_id == user_id).all()

def update_account_balance(db: Session, account_id: int, new_balance: float) -> Account:
    db_account = db.query(Account).filter(Account.id == account_id).first()
    if db_account:
        db_account.balance = new_balance
        db.commit()
        db.refresh(db_account)
    return db_account

# Transaction operations
def create_transaction(
    db: Session,
    user_id: int,
    account_id: int,
    amount: float,
    transaction_type: str,
    description: str,
    merchant: str,
    category: str,
    location: str,
    fraud_score: float = 0.0,
    metadata: Dict[str, Any] = None
) -> Transaction:
    db_transaction = Transaction(
        user_id=user_id,
        account_id=account_id,
        amount=amount,
        transaction_type=transaction_type,
        description=description,
        merchant=merchant,
        category=category,
        location=location,
        fraud_score=fraud_score,
        metadata=metadata or {}
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_user_transactions(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100
) -> List[Transaction]:
    return db.query(Transaction)\
        .filter(Transaction.user_id == user_id)\
        .order_by(Transaction.timestamp.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_account_transactions(
    db: Session,
    account_id: int,
    skip: int = 0,
    limit: int = 100
) -> List[Transaction]:
    return db.query(Transaction)\
        .filter(Transaction.account_id == account_id)\
        .order_by(Transaction.timestamp.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

# Chat operations
def create_chat_session(db: Session, user_id: int, session_id: str) -> ChatSession:
    db_session = ChatSession(
        user_id=user_id,
        session_id=session_id
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def create_chat_message(
    db: Session,
    session_id: str,
    message: str,
    role: str,
    intent: str = None,
    confidence: float = None,
    metadata: Dict[str, Any] = None
) -> ChatMessage:
    db_message = ChatMessage(
        session_id=session_id,
        message=message,
        role=role,
        intent=intent,
        confidence=confidence,
        metadata=metadata or {}
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_chat_history(
    db: Session,
    session_id: str,
    skip: int = 0,
    limit: int = 100
) -> List[ChatMessage]:
    return db.query(ChatMessage)\
        .filter(ChatMessage.session_id == session_id)\
        .order_by(ChatMessage.timestamp.asc())\
        .offset(skip)\
        .limit(limit)\
        .all() 