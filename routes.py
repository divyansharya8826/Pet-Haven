from flask import Flask, jsonify, render_template, request, session
import os
from model import app, db, Dogs

# route for home page
# Enable server-side sessions for cart storage
app.secret_key = 'your_secret_key'  

@app.route("/")
def home():
    return render_template("petshop.html")


@app.route('/api/dogs', methods=['GET'])
def get_dogs():
    dogs = Dogs.query.all()
    dogs_data = [
        {
            "id": dog.dog_id,
            "name": dog.name,
            "breed": dog.breed,
            "age": dog.age,
            "price": dog.price,
            "image": dog.image
        }
        for dog in dogs
    ]
    return jsonify(dogs_data)

@app.route("/cart")
def cart_page():
    cart = session.get("cart", [])  # Retrieve cart from session
    return render_template("cart.html", cart=cart)

@app.route("/cart/add", methods=['POST'])
def add_to_cart():
    data = request.get_json()
    dog_id = data.get("dog_id")

    if not dog_id:
        return jsonify({"error": "Invalid request"}), 400

    # Fetch the dog from the database
    dog = Dogs.query.get(dog_id)
    if not dog:
        return jsonify({"error": "Dog not found"}), 404

    selected_dog = {
        "id": dog.dog_id,
        "name": dog.name,
        "breed": dog.breed,
        "age": dog.age,
        "price": dog.price,
        "image": dog.image
    }

    # Retrieve the cart from session
    cart = session.get("cart", [])

    # Avoid duplicates in cart
    if any(d["id"] == dog_id for d in cart):
        return jsonify({"message": "Dog already in cart!", "cart_count": len(cart)})

    cart.append(selected_dog)  # Add dog to cart
    session["cart"] = cart  # Save back to session
    session.modified = True  # Ensure session updates

    return jsonify({"message": "Dog added successfully!", "cart_count": len(cart)})

@app.route("/api/cart_count", methods=["GET"])
def get_cart_count():
    cart = session.get("cart", [])  # Get cart items from session
    return jsonify({"cart_count": len(cart)}) 

@app.route("/cart/remove", methods=["POST"])
def remove_from_cart():
    data = request.get_json()
    dog_id = data.get("dog_id")

    if not dog_id:
        return jsonify({"error": "Invalid request"}), 400

    cart = session.get("cart", [])

    # Remove the selected dog from the cart
    cart = [dog for dog in cart if str(dog["id"]) != str(dog_id)]
    session["cart"] = cart  # Save updated cart in session
    session.modified = True  # Ensure session updates

    return jsonify({"message": "Dog removed from cart!", "cart_count": len(cart)})


if __name__ == "__main__":
    app.run(debug=True)
