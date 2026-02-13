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
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_docs.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def test_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables and remove file
    Base.metadata.drop_all(bind=engine)
    engine.dispose() # Release connection pool
    if os.path.exists("test_docs.db"):
        os.remove("test_docs.db")

@pytest.fixture(scope="module")
def client(test_db):
    # Override dependency
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]

def test_docs(client):
    print("Registering user...")
    email = "docs_test@example.com"
    password = "password"
    
    # Register
    client.post("/api/auth/register", json={"email": email, "password": password, "full_name": "Test"})
    
    # Login
    login_res = client.post("/api/auth/login", data={"username": email, "password": password})
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Creating dummy PDF...")
    with open("dummy.pdf", "wb") as f:
        f.write(b"%PDF-1.4 header dummy content")
    
    try:
        print("Uploading document...")
        with open("dummy.pdf", "rb") as f:
            res = client.post(
                "/api/docs/upload?title=My%20Contract",
                files={"file": ("dummy.pdf", f, "application/pdf")},
                headers=headers
            )
        
        if res.status_code != 200:
            pytest.fail(f"Upload Failed: {res.text}")
    
        print("Upload Res:", res.json())
        
        print("Listing documents...")
        res = client.get("/api/docs/", headers=headers)
        print("List Res:", res.json())
        
        docs = res.json()
        assert len(docs) >= 1
        assert docs[0]["title"] == "My Contract"
        
    finally:
        if os.path.exists("dummy.pdf"):
            os.remove("dummy.pdf")

if __name__ == "__main__":
    # Manually run if executed as script
    # Note: verify fixtures might not run automatically without pytest
    print("Run with: pytest test_docs.py")


