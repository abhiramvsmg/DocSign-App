import requests
import os

# Test file upload
url = "http://127.0.0.1:8000/api/docs/upload?title=Test%20Document"

# Create a small test PDF
test_pdf = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 <<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Times-Roman\n>>\n>>\n>>\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n274\n%%EOF"

# Save test PDF
with open("test.pdf", "wb") as f:
    f.write(test_pdf)

# Get token (you'll need to login first)
login_url = "http://127.0.0.1:8000/api/auth/login"
login_data = {
    "username": "abhiram@gmail.com",
    "password": "password123"
}

print("1. Testing login...")
login_response = requests.post(login_url, data=login_data)
print(f"Login status: {login_response.status_code}")

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    print(f"✅ Got token: {token[:50]}...")
    
    print("\n2. Testing file upload...")
    headers = {"Authorization": f"Bearer {token}"}
    files = {"file": ("test.pdf", open("test.pdf", "rb"), "application/pdf")}
    
    upload_response = requests.post(url, headers=headers, files=files)
    print(f"Upload status: {upload_response.status_code}")
    print(f"Response: {upload_response.text}")
    
    if upload_response.status_code == 200:
        print("✅ UPLOAD SUCCESSFUL!")
    else:
        print(f"❌ UPLOAD FAILED: {upload_response.text}")
else:
    print(f"❌ LOGIN FAILED: {login_response.text}")

# Cleanup
os.remove("test.pdf")
