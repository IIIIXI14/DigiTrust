import subprocess
import sys
import os

def reset_postgres_password():
    try:
        print("Attempting to reset PostgreSQL password...")
        
        # Path to PostgreSQL password file
        pgpass_path = os.path.join(os.path.expanduser("~"), "pgpass.conf")
        
        # Create pgpass file content
        pgpass_content = "localhost:5432:*:postgres:5thdigitrust"
        
        # Write to pgpass file
        with open(pgpass_path, "w") as f:
            f.write(pgpass_content)
        
        # Set file permissions
        os.chmod(pgpass_path, 0o600)
        
        print("Created pgpass file for authentication")
        print("\nTrying to connect to PostgreSQL...")
        
        # Test connection using psycopg2
        import psycopg2
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="5thdigitrust",
            host="localhost",
            port="5432"
        )
        conn.close()
        print("Successfully connected to PostgreSQL!")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print("\nTroubleshooting steps:")
        print("1. Make sure PostgreSQL service is running")
        print("2. Try restarting PostgreSQL service")
        print("3. Check if port 5432 is not blocked")
        print("4. Verify PostgreSQL installation")

if __name__ == "__main__":
    reset_postgres_password() 