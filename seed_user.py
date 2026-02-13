from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine
from backend import models
from backend.utils.security import get_password_hash

def seed_user():
    db = SessionLocal()
    try:
        # Check if user already exists
        user = db.query(models.User).filter(models.User.email == "abhiram@gmail.com").first()
        if not user:
            print("Creating user abhiram@gmail.com...")
            hashed_password = get_password_hash("password123")
            user = models.User(
                full_name="Abhiram",
                email="abhiram@gmail.com",
                hashed_password=hashed_password
            )
            db.add(user)
            db.commit()
            print("User created successfully!")
        else:
            print("User already exists.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_user()
