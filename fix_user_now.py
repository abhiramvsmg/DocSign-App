import sqlite3
import os
from backend.utils.security import get_password_hash

# Use absolute path
db_path = os.path.join(os.path.dirname(__file__), "backend", "data", "docsign.db")

print(f"Database path: {db_path}")
print(f"Database exists: {os.path.exists(db_path)}")

conn = sqlite3.connect(db_path)
c = conn.cursor()

# Delete existing user
c.execute("DELETE FROM users WHERE email='abhiram@gmail.com'")
print("Deleted old user")

# Create new user with correct hash
hashed_password = get_password_hash("password123")
c.execute("""
    INSERT INTO users (email, hashed_password, full_name, created_at)
    VALUES (?, ?, ?, datetime('now'))
""", ("abhiram@gmail.com", hashed_password, "Abhiram"))

conn.commit()
print("✅ Created user: abhiram@gmail.com with password: password123")

# Verify
c.execute("SELECT id, email, full_name FROM users WHERE email='abhiram@gmail.com'")
user = c.fetchone()
print(f"✅ Verified user in DB: {user}")

conn.close()
print("\n🎉 USER READY TO LOGIN!")
