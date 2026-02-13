import urllib.request
import urllib.parse
import json
import base64

BASE_URL = "http://127.0.0.1:8000/api"

def test_sign():
    # 1. Login to get token
    login_data = urllib.parse.urlencode({
        "username": "docs_test@example.com",
        "password": "password"
    }).encode()
    
    try:
        print("Attempting to login...")
        req = urllib.request.Request(f"{BASE_URL}/auth/login", data=login_data)
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            token = res_data["access_token"]
            print("Login successful")

        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        
        # 2. Get documents
        req = urllib.request.Request(f"{BASE_URL}/docs/", headers={"Authorization": f"Bearer {token}"})
        with urllib.request.urlopen(req) as response:
            docs = json.loads(response.read().decode())
            if not docs:
                print("No documents found")
                return
            doc = docs[0]
            print(f"Found document: {doc['id']}")

        if not doc.get("signature_fields"):
            print("No signature fields found in first document")
            return
        
        field = doc["signature_fields"][0]
        
        # 3. Sign
        sign_data = json.dumps({
            "signature_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        }).encode('utf-8')
        
        print(f"Attempting to sign field {field['id']} in doc {doc['id']}...")
        req = urllib.request.Request(f"{BASE_URL}/docs/{doc['id']}/fields/{field['id']}/sign", data=sign_data, headers=headers)
        with urllib.request.urlopen(req) as response:
            res_content = response.read().decode()
            print(f"Sign Success! Response: {res_content}")
            
    except Exception as e:
        print(f"Error during test: {e}")
        if hasattr(e, 'read'):
            print(f"Response body: {e.read().decode()}")

if __name__ == "__main__":
    test_sign()
