import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text, inspect
from config.database import engine, Base
from models.database_models import User, Account, Transaction, ChatSession, ChatMessage

def test_connection():
    print("Testing database connection...")
    try:
        # Test the connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Successfully connected to the database!")
            
            # Test if tables exist
            print("\nChecking database tables...")
            inspector = inspect(engine)
            existing_tables = inspector.get_table_names()
            required_tables = ['users', 'accounts', 'transactions', 'chat_sessions', 'chat_messages']
            
            missing_tables = [table for table in required_tables if table not in existing_tables]
            
            if missing_tables:
                print("\n⚠️ Missing tables detected:", missing_tables)
                print("Creating missing tables...")
                Base.metadata.create_all(bind=engine)
                print("✅ Tables created successfully!")
            else:
                print("✅ All required tables exist!")
                
            # Print table information
            print("\nDatabase structure:")
            for table_name in inspector.get_table_names():
                columns = inspector.get_columns(table_name)
                print(f"\n📋 Table: {table_name}")
                for column in columns:
                    print(f"  - {column['name']}: {column['type']}")
                    
    except Exception as e:
        print(f"❌ Error connecting to database: {str(e)}")
        print("\nDebug information:")
        print("1. Check if PostgreSQL is running")
        print("2. Verify database credentials in .env file")
        print("3. Make sure database 'banking_db' exists")
        print("4. Check if port 5432 is accessible")
        sys.exit(1)

if __name__ == "__main__":
    test_connection() 