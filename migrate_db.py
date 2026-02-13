import sqlite3
import os

def migrate():
    db_path = 'docsign.db'
    if not os.path.exists(db_path):
        print("Database file not found. It will be created on next server start.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Add signed_file_path to documents
        print("Adding signed_file_path to documents table...")
        cursor.execute("ALTER TABLE documents ADD COLUMN signed_file_path TEXT;")
    except sqlite3.OperationalError as e:
        print(f"Skipping documents.signed_file_path: {e}")

    try:
        # Add signer_email to signature_fields
        print("Adding signer_email to signature_fields table...")
        cursor.execute("ALTER TABLE signature_fields ADD COLUMN signer_email TEXT;")
    except sqlite3.OperationalError as e:
        print(f"Skipping signature_fields.signer_email: {e}")

    try:
        # Create audit_logs table
        print("Creating audit_logs table...")
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
    except sqlite3.OperationalError as e:
        print(f"Error creating audit_logs: {e}")

    conn.commit()
    conn.close()
    print("Migration completed.")

if __name__ == "__main__":
    migrate()
