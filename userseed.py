import uuid
from flask_bcrypt import Bcrypt
from models import app, db, User, UserType

# Initialize Bcrypt for password hashing
bcrypt = Bcrypt()

# Function to seed dummy users
def seed_users():
    # Clear existing data (optional)
    db.session.query(User).delete()
    
    # Dummy user data
    users = [
        User(
            user_id=str(uuid.uuid4()),
            name="Admin User",
            email="admin@example.com",
            password=bcrypt.generate_password_hash("admin123").decode("utf-8"),
            user_type=UserType.ADMIN,
            is_active=True
        ),
        User(
            user_id=str(uuid.uuid4()),
            name="John Doe",
            email="john@example.com",
            password=bcrypt.generate_password_hash("password123").decode("utf-8"),
            user_type=UserType.OWNER,
            is_active=True
        ),
        User(
            user_id=str(uuid.uuid4()),
            name="Alice Smith",
            email="alice@example.com",
            password=bcrypt.generate_password_hash("mypassword").decode("utf-8"),
            user_type=UserType.OWNER,
            is_active=True
        ),
        User(
            user_id=str(uuid.uuid4()),
            name="Mike Johnson",
            email="mike@example.com",
            password=bcrypt.generate_password_hash("securepass").decode("utf-8"),
            user_type=UserType.SERVICE_PROVIDER,
            is_active=True
        ),
        User(
            user_id=str(uuid.uuid4()),
            name="Sarah Brown",
            email="sarah@example.com",
            password=bcrypt.generate_password_hash("providerpass").decode("utf-8"),
            user_type=UserType.SERVICE_PROVIDER,
            is_active=True
        ),
    ]

    # Insert into database
    db.session.add_all(users)
    db.session.commit()
    print("Dummy users inserted successfully!")

with app.app_context():  # Ensure Flask app context is available
    seed_users()