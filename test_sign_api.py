import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_sign():
    # 1. Login to get token
    login_data = {
        "username": "docs_test@example.com",
        "password": "password"
    }
    try:
        res = requests.post(f"{BASE_URL}/auth/login", data=login_data)
        if res.status_code != 200:
            print(f"Login failed: {res.text}")
            # Try to register if login fails
            reg_data = {"email": "docs_test@example.com", "password": "password", "full_name": "Test User"}
            requests.post(f"{BASE_URL}/auth/register", json=reg_data)
            res = requests.post(f"{BASE_URL}/auth/login", data=login_data)
            
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Get documents
        res = requests.get(f"{BASE_URL}/docs/", headers=headers)
        docs = res.json()
        if not docs:
            print("No documents found")
            return
            
        doc = docs[0]
        if not doc["signature_fields"]:
            print(f"Document {doc['id']} has no signature fields")
            return
            
        field = doc["signature_fields"][0]
        
        # 3. Try to sign
        sign_data = {
            "signature_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        }
        print(f"Testing sign for doc {doc['id']}, field {field['id']}...")
        res = requests.post(f"{BASE_URL}/docs/{doc['id']}/fields/{field['id']}/sign", json=sign_data, headers=headers)
        
        print(f"Status Code: {res.status_code}")
        print(f"Response: {res.text}")
        
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    test_sign()
