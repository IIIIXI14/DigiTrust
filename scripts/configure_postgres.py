import os
import sys
import subprocess
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def configure_postgres():
    try:
        print("Configuring PostgreSQL...")
        
        # Try to connect with psycopg2 first
        try:
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
            
            # Update authentication method for the postgres user
            cur.execute("""
                ALTER USER postgres WITH PASSWORD '5thdigitrust';
            """)
            
            print("Updated postgres user password")
            
            # Check if banking_db exists
            cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'banking_db'")
            exists = cur.fetchone()
            
            if not exists:
                print("Creating banking_db database...")
                cur.execute('CREATE DATABASE banking_db')
                print("Database created successfully!")
            else:
                print("Database banking_db already exists")
            
            # Close connection
            cur.close()
            conn.close()
            
            print("\nTesting connection to banking_db...")
            # Test connection to banking_db
            test_conn = psycopg2.connect(
                dbname="banking_db",
                user="postgres",
                password="5thdigitrust",
                host="localhost",
                port="5432"
            )
            test_conn.close()
            print("Successfully connected to banking_db!")
            
        except psycopg2.OperationalError as e:
            print(f"Could not connect to PostgreSQL: {e}")
            print("\nPlease ensure:")
            print("1. PostgreSQL service is running")
            print("2. Password is correct")
            print("3. Port 5432 is not blocked")
            print("4. pg_hba.conf is configured correctly")
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print("\nTroubleshooting steps:")
        print("1. Make sure PostgreSQL is installed")
        print("2. Check if the PostgreSQL service is running")
        print("3. Verify the password in your .env file")
        print("4. Make sure port 5432 is not blocked by firewall")

if __name__ == "__main__":
    configure_postgres() 