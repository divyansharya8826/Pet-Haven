import pytest
from model import app, db, Dogs

@pytest.fixture
def client():
    # Configure test database
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"  # In-memory DB
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # Create test database tables
        yield client

        # Cleanup
        with app.app_context():
            db.drop_all()