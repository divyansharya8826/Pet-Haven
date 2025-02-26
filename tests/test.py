from test_config import app, db, Dogs

def test_get_dogs(client):
    response = client.get("/api/dogs")
    assert response.status_code == 200
    assert isinstance(response.json, list)  # Ensure response is a list

def test_get_dog_by_id(client):
    with app.app_context():
        dog = Dogs(name="Buddy", breed="Labrador", age="Adult", price=8000, image="static/images/buddy.jpg")
        db.session.add(dog)
        db.session.commit()

    response = client.get(f"/dogs/{dog.dog_id}")
    assert response.status_code == 200
    assert response.json["name"] == "Buddy"

def test_dog_not_found(client):
    response = client.get("/dogs/nonexistent-id")
    assert response.status_code == 404
    assert response.json["error"] == "Dog not found"

def test_dog_details_page(client):
    with app.app_context():
        dog = Dogs(name="Charlie", breed="Golden Retriever", age="Puppy", price=10000, image="static/images/charlie.jpg")
        db.session.add(dog)
        db.session.commit()

    response = client.get(f"/dogs/{dog.dog_id}")
    assert response.status_code == 200
    assert b"Charlie" in response.data  # Ensure name appears on page

def test_add_to_cart(client):
    response = client.post("/cart/add", json={"dog_id": "3f5a46d6-4d9b-4f35-a616-24e39a69e7f1"})
    assert response.status_code == 200
    assert response.json["message"] == "Dog added to cart"

def test_remove_from_cart(client):
    response = client.post("/cart/remove", json={"dog_id": "3f5a46d6-4d9b-4f35-a616-24e39a69e7f1"})
    assert response.status_code == 200
    assert response.json["message"] == "Dog removed from cart"