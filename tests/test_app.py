import pytest
import sys
import os
from testmodels import app, db, Dogs, Cart, CartItem

# Ensure correct path to the test database inside `tests/instance/`
TEST_DB_DIR = os.path.join(os.path.dirname(__file__), "instance")
TEST_DB_PATH = os.path.join(TEST_DB_DIR, "test.db")

@pytest.fixture
def client():
    """Setup Flask test client with database inside 'tests/instance/'."""
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{TEST_DB_PATH}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Ensure 'instance' folder exists
    os.makedirs(TEST_DB_DIR, exist_ok=True)

    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # ✅ Create tables in test.db
        yield client

        # Cleanup: Remove test database after tests finish
        with app.app_context():
            db.drop_all()
            if os.path.exists(TEST_DB_PATH):
                os.remove(TEST_DB_PATH)

# Test fetching all dogs
def test_get_dogs(client):
    response = client.get("/api/dogs")
    assert response.status_code == 200
    assert isinstance(response.json, list)  # Ensure response is a list

# Test fetching a single dog by ID
def test_get_dog_by_id(client):
    with app.app_context():
        dog = Dogs(name="Buddy", breed="Labrador", age="Adult", price=8000, image="static/images/buddy.jpg")
        db.session.add(dog)
        db.session.commit()

    response = client.get(f"/dogs/{dog.dog_id}")
    assert response.status_code == 200
    assert response.json["name"] == "Buddy"

# Test fetching a non-existent dog ID
def test_dog_not_found(client):
    response = client.get("/dogs/nonexistent-id")
    assert response.status_code == 404
    assert response.json["error"] == "Dog not found"

# Test rendering the dog details page
def test_dog_details_page(client):
    with app.app_context():
        dog = Dogs(name="Charlie", breed="Golden Retriever", age="Puppy", price=10000, image="static/images/charlie.jpg")
        db.session.add(dog)
        db.session.commit()

    response = client.get(f"/dogs/{dog.dog_id}")
    assert response.status_code == 200
    assert b"Charlie" in response.data  # Ensure name appears on page

# Test adding a dog to the cart (with valid dog ID)
def test_add_to_cart(client):
    with app.app_context():
        dog = Dogs(name="Max", breed="Beagle", age="Young", price=7000, image="static/images/max.jpg")
        db.session.add(dog)
        db.session.commit()

    response = client.post("/cart/add", json={"dog_id": dog.dog_id})  # Pass valid dog_id
    assert response.status_code == 200
    assert response.json["message"] == "Dog added successfully!"

# Test removing a dog from the cart (with valid dog ID)
def test_remove_from_cart(client):
    with app.app_context():
        dog = Dogs(name="Lucy", breed="Shih Tzu", age="Adult", price=9000, image="static/images/lucy.jpg")
        db.session.add(dog)
        db.session.commit()

        # Create a cart entry
        cart = Cart(user_id="test_user", total_amount=0)
        db.session.add(cart)
        db.session.commit()

        # Add item to cart
        cart_item = CartItem(cart_id=cart.cart_id, dog_id=dog.dog_id)
        db.session.add(cart_item)
        db.session.commit()

    # Remove the dog from the cart
    response = client.post("/cart/remove", json={"dog_id": dog.dog_id})
    assert response.status_code == 200
    assert response.json["message"] == "Dog removed from cart"

if __name__ == "__main__":
    app.run(debug=True)