from flask import Flask, jsonify, render_template, request, session, redirect, url_for, flash
import os
from models import app, db, Dogs, Cart, CartItem, Order, OrderDetail
import uuid

#************************************* secret key for the session *******************************************
app.secret_key = str(uuid.uuid4())

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


#************************************** Individual Dog Display route ****************************************

@app.route('/dogs/<string:dog_id>', methods=['GET'])
def dog_details(dog_id):
    dog = Dogs.query.get(dog_id)
    if not dog:
        return jsonify({"error": "Dog not found"}), 404
    return jsonify({
    "id": dog.dog_id,
    "name": dog.name,
    "breed": dog.breed,
    "age": dog.age,
    "price": dog.price,
    "image": dog.image,
    "vaccinated": dog.vaccinated,
    "description": dog.description
    })

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
    if "user_id" not in session:
        return redirect(url_for("login"))  # Redirect if not logged in

    user_id = session["user_id"]
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart or not cart.cart_items:
        return render_template("cart.html", cart=[])

    # Fetch cart items
    cart_items = [
        {
            "id": item.dog.dog_id,
            "name": item.dog.name,
            "breed": item.dog.breed,
            "age": item.dog.age,
            "price": item.dog.price,
            "image": item.dog.image
        }
        for item in cart.cart_items
    ]

    return render_template("cart.html", cart=cart_items)

#******************************** route for add to cart functionality ***************************************
@app.route("/cart/add", methods=['POST'])
def add_to_cart():
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401

    data = request.get_json()
    dog_id = data.get("dog_id")
    user_id = session["user_id"]  # Fetch user_id from session

    if not dog_id:
        return jsonify({"error": "Invalid request"}), 400

    # Check if the user already has a cart
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=user_id, total_amount=0)
        db.session.add(cart)
        db.session.commit()

    # Check if the dog is already in the cart
    cart_item = CartItem.query.filter_by(cart_id=cart.cart_id, dog_id=dog_id).first()
    if cart_item:
        return jsonify({"message": "Dog already in cart!", "cart_count": len(cart.cart_items)})

    # Add dog to cart
    cart_item = CartItem(cart_id=cart.cart_id, dog_id=dog_id)
    db.session.add(cart_item)
    db.session.commit()

    return jsonify({"message": "Dog added successfully!", "cart_count": len(cart.cart_items)})

#************************************ api for updating cart count ******************************************
@app.route("/api/cart_count", methods=["GET"])
def get_cart_count():
    if "user_id" not in session:
        return jsonify({"cart_count": 0})  # Return 0 if user not logged in

    user_id = session["user_id"]

    # Fetch the cart for the user
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({"cart_count": 0})  # No cart exists for the user

    cart_count = db.session.query(CartItem).filter_by(cart_id=cart.cart_id).count()
    
    return jsonify({"cart_count": cart_count})

#************************************* route for removing dog entry from the cart ***************************
@app.route("/cart/remove", methods=["POST"])
def remove_from_cart():
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401

    data = request.get_json()
    dog_id = data.get("dog_id")
    user_id = session["user_id"]

    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        return jsonify({"error": "Cart not found"}), 404

    cart_item = CartItem.query.filter_by(cart_id=cart.cart_id, dog_id=dog_id).first()
    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()

    return jsonify({"message": "Dog removed from cart!", "cart_count": len(cart.cart_items)})

#************************************* route for order summary ***********************************************

@app.route("/order")
def order_summary():
    if "user_id" not in session:
        return redirect(url_for("login"))  # ✅ Corrected login redirect

    user_id = session["user_id"]
    order = Order.query.filter_by(user_id=user_id).order_by(Order.order_date.desc()).first()

    if not order:
        return render_template("order_summary.html", order=None)

    order_items = [
        {
            "id": item.dog.dog_id if item.dog else None,  # Handle cases where item.dog is None
            "name": item.dog.name if item.dog else "Service Booking",
            "breed": item.dog.breed if item.dog else "N/A",
            "age": item.dog.age if item.dog else "N/A",
            "price": item.dog.price if item.dog else item.booking.total_cost,  # Handle bookings
            "image": item.dog.image if item.dog else "static/images/default.jpg"
        }
        for item in order.order_details
    ]

    return render_template("order_summary.html", order=order, cart=order_items)
    
#************************************* route for order summary ***************************

@app.route('/order-confirm')
def order_confirm():
    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart or not cart.cart_items:
        flash("Your cart is empty!", "warning")
        return redirect(url_for("cart_page"))

    # Calculate total amount
    total_amount = sum(
        item.dog.price if item.dog else item.booking.total_cost
        for item in cart.cart_items
    )

    # Create a new order
    order = Order(user_id=user_id, total_amount=total_amount, shipping_address="User Address")
    db.session.add(order)
    db.session.commit()

    # Move cart items to order details
    order_items = []
    for cart_item in cart.cart_items:
        order_item = OrderDetail(
            order_id=order.order_id,
            dog_id=cart_item.dog_id if cart_item.dog else None,
            booking_id=cart_item.booking_id if cart_item.booking else None,
            quantity=cart_item.quantity
        )
        db.session.add(order_item)
        order_items.append(order_item)

    db.session.commit()  # Commit all order items

    # Clear the cart after order placement
    CartItem.query.filter_by(cart_id=cart.cart_id).delete()
    db.session.commit()

    # Fetch order details for rendering the confirmation page
    order_items_data = [
        {
            "id": item.dog.dog_id if item.dog else None,
            "name": item.dog.name if item.dog else "Service Booking",
            "breed": item.dog.breed if item.dog else "N/A",
            "age": item.dog.age if item.dog else "N/A",
            "price": item.dog.price if item.dog else item.booking.total_cost,
            "image": item.dog.image if item.dog else "static/images/default.jpg"
        }
        for item in order.order_details
    ]

    return render_template("order_confirm.html", order=order, cart=order_items_data)

#************************************* route for log out ******************************************************
@app.route("/logout")
def logout():
    session.pop("user_id", None)  # Remove user_id from session
    return redirect("/login")

@app.route('/services') # change name of the route to services from dashboard
def services():
    return render_template('dashboard.html')


if __name__ == "__main__":
    app.run(debug=True)
