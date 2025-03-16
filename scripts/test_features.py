import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import func
from config.database import SessionLocal
from models.database_models import User, Account, Transaction, ChatSession, ChatMessage
from datetime import datetime, timedelta

def test_database_features():
    db = SessionLocal()
    try:
        print("Testing database features...\n")

        # 1. Test User Features
        print("1. Testing User Features:")
        user_count = db.query(User).count()
        print(f"Total users: {user_count}")
        
        # Get user with their accounts
        user = db.query(User).first()
        print(f"User: {user.full_name}")
        print(f"Number of accounts: {len(user.accounts)}")
        print(f"Number of transactions: {len(user.transactions)}")

        # 2. Test Account Features
        print("\n2. Testing Account Features:")
        # Get total balance across all accounts
        total_balance = db.query(func.sum(Account.balance)).scalar()
        print(f"Total balance across all accounts: ${total_balance:.2f}")
        
        # Get accounts by type
        for acc_type in ["savings", "checking", "investment"]:
            count = db.query(Account).filter(Account.account_type == acc_type).count()
            print(f"Number of {acc_type} accounts: {count}")

        # 3. Test Transaction Features
        print("\n3. Testing Transaction Features:")
        # Get transaction statistics
        stats = db.query(
            func.count(Transaction.id).label('total'),
            func.sum(Transaction.amount).label('total_amount'),
            func.avg(Transaction.fraud_score).label('avg_fraud_score')
        ).first()
        print(f"Total transactions: {stats.total}")
        print(f"Total transaction amount: ${stats.total_amount:.2f}")
        print(f"Average fraud score: {stats.avg_fraud_score:.3f}")
        
        # Get transactions by category
        print("\nTransactions by category:")
        category_stats = db.query(
            Transaction.category,
            func.count(Transaction.id).label('count'),
            func.sum(Transaction.amount).label('total')
        ).group_by(Transaction.category).all()
        
        for cat in category_stats:
            print(f"{cat.category}: {cat.count} transactions, total ${cat.total:.2f}")

        # 4. Test Chat Features
        print("\n4. Testing Chat Features:")
        # Get chat statistics
        session_count = db.query(ChatSession).count()
        message_count = db.query(ChatMessage).count()
        print(f"Total chat sessions: {session_count}")
        print(f"Total chat messages: {message_count}")
        
        # Get messages by role
        print("\nMessages by role:")
        role_stats = db.query(
            ChatMessage.role,
            func.count(ChatMessage.id).label('count')
        ).group_by(ChatMessage.role).all()
        
        for role in role_stats:
            print(f"{role.role}: {role.count} messages")

        # 5. Test Relationships
        print("\n5. Testing Relationships:")
        # Get a sample account with its transactions
        account = db.query(Account).first()
        print(f"Account: {account.account_type} ({account.account_number})")
        print(f"Owner: {account.owner.full_name}")
        print(f"Number of transactions: {len(account.transactions)}")
        
        # Get a sample chat session with its messages
        session = db.query(ChatSession).first()
        messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == session.session_id
        ).order_by(ChatMessage.timestamp).all()
        
        print(f"\nChat session with user: {db.query(User).get(session.user_id).full_name}")
        print("Conversation:")
        for msg in messages:
            print(f"{msg.role}: {msg.message}")

        print("\n✅ All database features tested successfully!")

    except Exception as e:
        print(f"❌ Error testing features: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    test_database_features() 