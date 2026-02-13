import requests

def test_login():
    url = "http://127.0.0.1:8000/api/auth/login"
    data = {
        "username": "abhiram@gmail.com",
        "password": "password123"
    }
    print(f"Testing login at {url}...")
    try:
        response = requests.post(url, data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
