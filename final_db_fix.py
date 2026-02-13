import sqlite3
import os

def final_db_fix():
    db_path = 'backend/data/docsign.db'
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}. Checking local...")
        db_path = 'docsign.db'
        if not os.path.exists(db_path):
            print("Database not found anywhere.")
            return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    def add_col(table, col):
        try:
            cursor.execute(f"ALTER TABLE {table} ADD COLUMN {col} TEXT;")
            print(f"Added {col} to {table}")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print(f"{col} already exists in {table}")
            else:
                print(f"Error adding {col} to {table}: {e}")

    add_col('documents', 'signed_file_path')
    add_col('documents', 'signing_token')
    add_col('signature_fields', 'signer_email')

    # Ensure audit_logs exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER,
            action TEXT NOT NULL,
            user_id INTEGER,
            details TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (document_id) REFERENCES documents(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    ''')
    print("Audit logs table checked/created.")

    conn.commit()
    
    # VERIFY
    print("\n--- FINAL VERIFICATION ---")
    cursor.execute("PRAGMA table_info(documents);")
    print("Documents Columns:", [c[1] for c in cursor.fetchall()])
    cursor.execute("PRAGMA table_info(signature_fields);")
    print("Signature Fields Columns:", [c[1] for c in cursor.fetchall()])
    
    conn.close()

if __name__ == "__main__":
    final_db_fix()
