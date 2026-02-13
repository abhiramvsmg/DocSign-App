import sqlite3

def check_db():
    try:
        conn = sqlite3.connect('docsign.db')
        cursor = conn.cursor()
        
        # Check tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print(f"Tables: {tables}")
        
        if ('documents',) in tables:
            cursor.execute("PRAGMA table_info(documents);")
            info = cursor.fetchall()
            print(f"Documents Schema: {info}")
            
        # Check signature_fields
        if ('signature_fields',) in tables:
            cursor.execute("PRAGMA table_info(signature_fields);")
            info = cursor.fetchall()
            print(f"Signature Fields Schema: {info}")
            
            cursor.execute("SELECT COUNT(*) FROM signature_fields;")
            count = cursor.fetchone()[0]
            print(f"Total Signature Fields: {count}")
            
            cursor.execute("SELECT * FROM signature_fields LIMIT 5;")
            rows = cursor.fetchall()
            print(f"Sample Rows: {rows}")
        else:
            print("ERROR: signature_fields table MISSING")

        # Check audit_logs
        if ('audit_logs',) in tables:
            print("audit_logs table EXISTS")
            cursor.execute("PRAGMA table_info(audit_logs);")
            info = cursor.fetchall()
            print(f"Audit Logs Schema: {info}")
        else:
            print("ERROR: audit_logs table MISSING")
            
        # Check users
        if ('users',) in tables:
            cursor.execute("SELECT id, email, full_name FROM users;")
            users = cursor.fetchall()
            print(f"Users: {users}")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    check_db()
