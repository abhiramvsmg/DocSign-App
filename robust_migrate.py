import sqlite3
import time
import os

def migrate_with_retry():
    db_path = 'docsign.db'
    if not os.path.exists(db_path):
        print("Database not found.")
        return

    for i in range(5):
        try:
            conn = sqlite3.connect(db_path, timeout=10)
            cursor = conn.cursor()
            
            # Helper to add column if not exists
            def add_column(table, column, type):
                cursor.execute(f"PRAGMA table_info({table})")
                columns = [c[1] for c in cursor.fetchall()]
                if column not in columns:
                    print(f"Adding {column} to {table}...")
                    cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {type};")
                    print(f"Successfully added {column} to {table}.")
                else:
                    print(f"Column {column} already exists in {table}.")

            add_column('documents', 'signed_file_path', 'TEXT')
            add_column('signature_fields', 'signer_email', 'TEXT')
            
            # Audit logs table
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
            print("Audit logs table verified/created.")
            
            conn.commit()
            conn.close()
            print("Migration successful.")
            return
        except sqlite3.OperationalError as e:
            print(f"Migration attempt {i+1} failed: {e}")
            if "locked" in str(e):
                time.sleep(2)
            else:
                raise e
    print("Migration failed after retries.")

if __name__ == "__main__":
    migrate_with_retry()
