import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from config.database import SessionLocal, engine
from models.database_models import User, Account, Transaction, ChatSession, ChatMessage
from datetime import datetime, timedelta
import random
import uuid
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_sample_data():
    db = SessionLocal()
    try:
        print("Creating sample data...")

        # Create sample users
        users = [
            {
                "email": "john.doe@example.com",
                "password": "password123",
                "full_name": "John Doe"
            },
            {
                "email": "jane.smith@example.com",
                "password": "password456",
                "full_name": "Jane Smith"
            }
        ]

        db_users = []
        for user_data in users:
            db_user = User(
                email=user_data["email"],
                hashed_password=pwd_context.hash(user_data["password"]),
                full_name=user_data["full_name"]
            )
            db.add(db_user)
            db.flush()  # Flush to get the ID
            db_users.append(db_user)
            print(f"Created user: {user_data['full_name']}")

        # Create sample accounts
        account_types = ["savings", "checking", "investment"]
        for user in db_users:
            for acc_type in account_types:
                account = Account(
                    user_id=user.id,
                    account_type=acc_type,
                    account_number=f"{acc_type}-{uuid.uuid4().hex[:8]}",
                    balance=random.uniform(1000, 10000),
                    currency="USD"
                )
                db.add(account)
                db.flush()
                print(f"Created {acc_type} account for {user.full_name}")

                # Create sample transactions
                for _ in range(5):
                    amount = random.uniform(10, 1000)
                    transaction = Transaction(
                        user_id=user.id,
                        account_id=account.id,
                        transaction_type=random.choice(["debit", "credit"]),
                        amount=amount,
                        currency="USD",
                        description=f"Sample transaction of ${amount:.2f}",
                        merchant=random.choice(["Amazon", "Walmart", "Target", "Starbucks"]),
                        category=random.choice(["Shopping", "Groceries", "Entertainment"]),
                        location="New York, USA",
                        fraud_score=random.uniform(0, 1),
                        extra_data={"ip_address": "192.168.1.1", "device": "web"}
                    )
                    db.add(transaction)
                print(f"Created 5 transactions for account {account.account_number}")

        # Create sample chat sessions and messages
        for user in db_users:
            session = ChatSession(
                user_id=user.id,
                session_id=f"session-{uuid.uuid4().hex[:8]}",
                session_data={"browser": "Chrome", "platform": "Windows"}
            )
            db.add(session)
            db.flush()
            print(f"Created chat session for {user.full_name}")

            # Sample conversation
            conversation = [
                ("user", "What's my account balance?"),
                ("assistant", "Your savings account balance is $5,432.10", "balance_inquiry", 0.95),
                ("user", "Can you help me with a transfer?"),
                ("assistant", "I can help you transfer money. Which account would you like to transfer from?", "transfer_intent", 0.88)
            ]

            for role, message, *extras in conversation:
                chat_message = ChatMessage(
                    session_id=session.session_id,
                    message=message,
                    role=role,
                    intent=extras[0] if len(extras) > 0 and role == "assistant" else None,
                    confidence=extras[1] if len(extras) > 1 and role == "assistant" else None,
                    message_data={"timestamp_ms": int(datetime.now().timestamp() * 1000)}
                )
                db.add(chat_message)
            print(f"Created sample conversation for {user.full_name}")

        # Commit all changes
        db.commit()
        print("\n✅ Sample data created successfully!")

        # Print summary
        print("\nDatabase Summary:")
        print(f"Users created: {len(db_users)}")
        print(f"Accounts per user: {len(account_types)}")
        print(f"Transactions per account: 5")
        print(f"Chat sessions: {len(db_users)}")
        print(f"Messages per chat session: {len(conversation)}")

    except Exception as e:
        print(f"❌ Error creating sample data: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data() 