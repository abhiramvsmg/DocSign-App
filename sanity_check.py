import os
import sqlite3
from backend.utils.security import verify_password, get_password_hash

def check_system():
    print("--- SYSTEM SANITY CHECK ---")
    
    # 1. Check DB File
    db_path = "backend/data/docsign.db"
    if not os.path.exists(db_path):
        print(f"FAILED: Database not found at {db_path}")
        return
    print(f"SUCCESS: Database found at {db_path}")
    
    # 2. Check User and Password
    try:
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute("SELECT id, email, hashed_password FROM users WHERE email='abhiram@gmail.com'")
        user = c.fetchone()
        if not user:
            print("FAILED: User abhiram@gmail.com NOT found in DB.")
        else:
            print(f"SUCCESS: User {user[1]} found (ID: {user[0]})")
            # Verify password
            test_pw = "password123"
            if verify_password(test_pw, user[2]):
                print("SUCCESS: Password verification works.")
            else:
                print("FAILED: Password verification failed. Hash mismatch?")
        
        # 3. Check Documents table columns
        c.execute("PRAGMA table_info(documents)")
        cols = [col[1] for col in c.fetchall()]
        required_cols = ["status", "signed_file_path", "signing_token"]
        for rc in required_cols:
            if rc in cols:
                print(f"SUCCESS: 'documents' has column '{rc}'")
            else:
                print(f"FAILED: 'documents' MISSING column '{rc}'")
                
        conn.close()
    except Exception as e:
        print(f"ERROR: DB check failed: {e}")

    # 4. Check Uploads Directory
    if os.path.exists("uploads"):
        print("SUCCESS: 'uploads' directory exists.")
    else:
        print("WARNING: 'uploads' directory missing. Backend should create it.")

    print("--- CHECK COMPLETE ---")

if __name__ == "__main__":
    check_system()
