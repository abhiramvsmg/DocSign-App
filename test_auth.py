import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from backend.main import app
from backend.database import Base, get_db

# Setup Test Database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    engine.dispose() # Release connection pool
    if os.path.exists("test_auth.db"):
        os.remove("test_auth.db")

@pytest.fixture(scope="module")
def client(test_db):
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]

def test_flow(client):
    email = "auth_test@example.com"
    password = "password123"

    print("Testing Register...")
    response = client.post(
        "/api/auth/register",
        json={"email": email, "password": password, "full_name": "Test User"}
    )
    assert response.status_code == 200, f"Register failed: {response.text}"
    print("Register response:", response.json())
    
    print("\nTesting Login...")
    response = client.post(
        "/api/auth/login",
        data={"username": email, "password": password}
    )
    assert response.status_code == 200, f"Login failed: {response.text}"
    print("Login response:", response.json())
    
    token = response.json()["access_token"]
    assert token is not None
    print(f"\nGot Token: {token[:20]}...")
    print("\nAuth System Verified!")

if __name__ == "__main__":
    print("Run with: pytest test_auth.py")


