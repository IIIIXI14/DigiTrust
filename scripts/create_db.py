import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="5thdigitrust",
            host="localhost",
            port="5432"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        # Create a cursor
        cur = conn.cursor()
        
        # Check if database exists
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'banking_db'")
        exists = cur.fetchone()
        
        if not exists:
            print("Creating database 'banking_db'...")
            cur.execute('CREATE DATABASE banking_db')
            print("Database created successfully!")
        else:
            print("Database 'banking_db' already exists!")
        
        # Close connection
        cur.close()
        conn.close()
        
        print("\nTrying to connect to the new database...")
        # Test connection to the new database
        test_conn = psycopg2.connect(
            dbname="banking_db",
            user="postgres",
            password="5thdigitrust",
            host="localhost",
            port="5432"
        )
        test_conn.close()
        print("Successfully connected to 'banking_db'!")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    create_database() 