from flask import Flask, jsonify, render_template, request, session, redirect
import os
from models import app, db, Dogs
import uuid

#************************************ route for temprary login ***********************************************
@app.route("/login")
def login():
    user_id = request.args.get("user_id")  # Get user_id from URL

    if not user_id:
        return "Welcome to Pet Haven - Please login to continue!"

    session["user_id"] = user_id  # Store user_id in session

    return redirect("/")

#************************************ route for home page **************************************************
@app.route("/")
def home():
    if "user_id" in session:
        return render_template("petshop.html")
    return redirect("/login")

#************************************* secret key for the session *******************************************
app.secret_key = str(uuid.uuid4())

#************************************** Individual Dog Display route ****************************************

@app.route('/dogs/<string:dog_id>', methods=['GET'])
def dog_details(dog_id):
    dog = Dogs.query.get(dog_id)
    if not dog:
        return jsonify({"error": "Dog not found"}), 404

#*************************************** routes for fectching all dog details *******************************
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
            "image": dog.image,
            "vaccinated": dog.vaccinated,
            "description": dog.description
        }
        for dog in dogs
    ]
    return jsonify(dogs_data)

#******************************* Enable server-side sessions for cart storage *******************************
@app.route("/cart")
def cart_page():
    cart = session.get("cart", [])  # Retrieve cart from session
    return render_template("cart.html", cart=cart)

#******************************** route for add to cart functionality ***************************************
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

#************************************ api for updating cart count ******************************************
@app.route("/api/cart_count", methods=["GET"])
def get_cart_count():
    cart = session.get("cart", [])  # Get cart items from session
    return jsonify({"cart_count": len(cart)}) 

#************************************* route for removing dog entry from the cart ***************************
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

#************************************* route for order summary ***********************************************

@app.route("/order")
def order_summary():
    cart = session.get("cart", [])  # Retrieve order summary from session
    return render_template("order_summary.html", cart=cart)

#************************************* rout for log out ******************************************************
@app.route("/logout")
def logout():
    session.pop("user_id", None)  # Remove user_id from session
    return redirect("/login")    

if __name__ == "__main__":
    app.run(debug=True)
