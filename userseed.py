import uuid
from models import app, db, User, UserType
from werkzeug.security import generate_password_hash

# Function to seed dummy users
def seed_users():
    # Clear existing data (optional)
    db.session.query(User).delete()

    # Insert admin directly into User table
    admin_username = "Admin@123"
    admin_email = "admin@example.com"
    admin_password = "password@123"

    admin_user = User.query.filter_by(user_name=admin_username).first()
    if not admin_user:
        hashed_password = generate_password_hash(admin_password)
        admin = User(
            user_name=admin_username,
            email_id=admin_email,
            password=hashed_password,
            phone_number=None,
            address=None,
            user_type=None,  # NULL for Admin
            is_active=True
        )
        db.session.add(admin)
        db.session.commit()
        print("Inserted default admin user.")
    
    # Dummy user data
    users = [
            
            User(user_name="john_doe", email_id="john.doe@example.com", password=generate_password_hash("johnpass"), phone_number="9876543210", address="101 Elm St", user_type="Pet Owner", is_active=True),
            User(user_name="jane_smith", email_id="jane.smith@example.com", password=generate_password_hash("jane1234"), phone_number="8765432109", address="202 Oak St", user_type="Service Provider", is_active=True),
            User(user_name="peter_parker", email_id="peter.parker@example.com", password=generate_password_hash("spiderman"), phone_number="7654321098", address="303 Maple St", user_type="Pet Owner", is_active=True),
            User(user_name="bruce_wayne", email_id="bruce.wayne@example.com", password=generate_password_hash("batman"), phone_number="6543210987", address="404 Wayne Manor", user_type="Pet Owner", is_active=True),
            User(user_name="clark_kent", email_id="clark.kent@example.com", password=generate_password_hash("superman"), phone_number="5432109876", address="505 Metropolis St", user_type="Pet Owner", is_active=True),
            User(user_name="tony_stark", email_id="tony.stark@example.com", password=generate_password_hash("ironman"), phone_number="4321098765", address="606 Stark Tower", user_type="Service Provider", is_active=True),
            User(user_name="diana_prince", email_id="diana.prince@example.com", password=generate_password_hash("wonderwoman"), phone_number="3210987654", address="707 Themyscira", user_type="Pet Owner", is_active=True),
            User(user_name="steve_rogers", email_id="steve.rogers@example.com", password=generate_password_hash("captain"), phone_number="2109876543", address="808 Brooklyn St", user_type="Service Provider", is_active=True),
            User(user_name="natasha_romanoff", email_id="natasha.romanoff@example.com", password=generate_password_hash("blackwidow"), phone_number="1098765432", address="909 Red Room", user_type="Pet Owner", is_active=True),
            User(user_name="thor_odinson", email_id="thor.odinson@example.com", password=generate_password_hash("mjolnir"), phone_number="1987654321", address="Asgard", user_type="Service Provider", is_active=True),
            User(user_name="loki_laufeyson", email_id="loki.laufeyson@example.com", password=generate_password_hash("trickster"), phone_number="2876543210", address="Jotunheim", user_type="Pet Owner", is_active=False),
            User(user_name="wanda_maximoff", email_id="wanda.maximoff@example.com", password=generate_password_hash("scarletwitch"), phone_number="3765432109", address="Westview", user_type="Pet Owner", is_active=True),
            User(user_name="vision", email_id="vision@example.com", password=generate_password_hash("mindstone"), phone_number="4654321098", address="Avengers Compound", user_type="Service Provider", is_active=True),
            User(user_name="bruce_banner", email_id="bruce.banner@example.com", password=generate_password_hash("hulk"), phone_number="5543210987", address="Gamma Lab", user_type="Pet Owner", is_active=True),
            User(user_name="stephen_strange", email_id="stephen.strange@example.com", password=generate_password_hash("sorcerer"), phone_number="6432109876", address="Sanctum Sanctorum", user_type="Service Provider", is_active=True),
            User(user_name="peter_quill", email_id="peter.quill@example.com", password=generate_password_hash("starlord"), phone_number="7321098765", address="Milano", user_type="Pet Owner", is_active=True),
            User(user_name="gamora", email_id="gamora@example.com", password=generate_password_hash("deadliestwoman"), phone_number="8210987654", address="Knowhere", user_type="Pet Owner", is_active=True),
            User(user_name="rocket_raccoon", email_id="rocket@example.com", password=generate_password_hash("boom"), phone_number="9109876543", address="Guardians Ship", user_type="Service Provider", is_active=True),
            User(user_name="groot", email_id="groot@example.com", password=generate_password_hash("iamgroot"), phone_number="0198765432", address="Guardians Ship", user_type="Pet Owner", is_active=True),
        ]

    # Insert into database
    db.session.add_all(users)
    db.session.commit()
    print("Dummy users inserted successfully!")

with app.app_context():  # Ensure Flask app context is available
    seed_users()