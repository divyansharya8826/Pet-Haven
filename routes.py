from flask import Flask, jsonify, render_template, request, session, redirect, url_for, flash
import os
from models import app, db, Dogs, Cart, CartItem, Order, OrderDetail, Service, ServiceProvider, ServiceProviderStatus, PaymentStatus
import uuid
from flask import render_template, jsonify
from models import ServiceProvider
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename

#************************************* secret key for the session *******************************************
app.secret_key = str(uuid.uuid4())

#************************************ route for temprary login ***********************************************
@app.route("/login")
def login():
    user_id = request.args.get("user_id")  
    admin_id = request.args.get("admin_id")  

    if admin_id:  # If admin is logging in
        session["user_id"] = admin_id
        session["role"] = "admin"
        print("Admin Logged In:", session)  # Debugging output
        return redirect(url_for("admin_dashboard"))    

    elif user_id:  # If regular user is logging in
        session["user_id"] = user_id
        session["role"] = "user"
        print("User Logged In:", session)  # Debugging output
        return redirect("/")    

    else:  # If no credentials are provided
        return "Welcome to Pet Haven - Please login to continue!" 

# ********************************* Admin Dashboard Route *********************************
@app.route("/admin")
def admin_dashboard():
    print("Admin Dashboard Session:", session)  # Debugging output
    if session.get("role") != "admin":
        return "Access Denied! Admins only.", 403  

    return render_template("admin.html")

# ******************** Configuration for Image Uploads ********************
app.config["UPLOAD_FOLDER"] = "static/images"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ************************************* Route to Add a New Dog **********************************************
@app.route("/admin/dogs/add", methods=["POST"])
def add_dog():
    if session.get("role") != "admin":
        return jsonify({"error": "Access Denied! Admins only"}), 403

    data = request.form
    name = data.get("name")
    breed = data.get("breed")
    age = data.get("age")
    price = data.get("price")
    vaccinated = data.get("vaccinated", "No")  # Default to 'No'
    description = data.get("description")

    # Fix: Check if all required fields are present
    if not all([name, breed, age, price, description]):
        return jsonify({"error": "Missing required fields"}), 400

    # Fix: Convert price to integer
    try:
        price = int(price)
    except ValueError:
        return jsonify({"error": "Invalid price value"}), 400

    # Fix: Ensure images directory exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Fix: Handle Image Upload
    image_filename = "default.jpg"
    image = request.files.get("image")

    if image and allowed_file(image.filename):
        image_filename = secure_filename(image.filename)
        image_path = os.path.join(app.config["UPLOAD_FOLDER"], image_filename)
        image.save(image_path)

    # Fix: Store Dog in DB
    new_dog = Dogs(
        name=name,
        breed=breed,
        age=age,
        price=price,
        vaccinated=vaccinated,
        description=description,
        image=f"static/images/{image_filename}"
    )

    db.session.add(new_dog)
    db.session.commit()

    return jsonify({"message": "Dog added successfully!", "dog_id": new_dog.dog_id})


# ******************** Route to Delete a Dog ********************
@app.route("/admin/dogs/delete/<string:dog_id>", methods=["DELETE"])
def delete_dog(dog_id):
    if session.get("role") != "admin":
        return jsonify({"error": "Access Denied! Admins only"}), 403

    dog = Dogs.query.get(dog_id)
    if not dog:
        return jsonify({"error": "Dog not found"}), 404

    # Check if image exists before deleting
    if dog.image != "static/images/default.jpg" and os.path.exists(dog.image):
        try:
            os.remove(dog.image)
        except FileNotFoundError:
            print(f"Warning: File {dog.image} not found")  # Debugging info

    db.session.delete(dog)
    db.session.commit()

    return jsonify({"message": "Dog deleted successfully!"})


# ******************** Route to Edit a Dog ********************
@app.route("/admin/dogs/edit/<string:dog_id>", methods=["POST"])
def edit_dog(dog_id):
    if session.get("role") != "admin":
        return jsonify({"error": "Access Denied! Admins only"}), 403

    dog = Dogs.query.get(dog_id)
    if not dog:
        return jsonify({"error": "Dog not found"}), 404

    # Handle JSON data properly
    if request.is_json:
        data = request.get_json()
        dog.name = data.get("name", dog.name)
        dog.price = int(data.get("price", dog.price))  # Convert to int

    db.session.commit()
    return jsonify({"message": "Dog updated successfully!"})
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
    ]if cart and cart.cart_items else []

    return render_template("cart.html", cart=cart_items)

#**************************************** route for cart api ************************************************
@app.route("/api/cart", methods=["GET"])
def get_cart_items():
    """Fetch the current user's cart items from the database."""
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401  # User must be logged in

    user_id = session["user_id"]
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart or not cart.cart_items:
        return jsonify({"cart": []})  # Return empty list if no cart items

    # Fetch cart items along with dog details
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

    return jsonify({"cart": cart_items})

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

    # Find the cart item to remove
    cart_item = CartItem.query.filter_by(cart_id=cart.cart_id, dog_id=dog_id).first()
    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()
    
    # Recalculate total amount
    total_amount = sum(item.dog.price for item in cart.cart_items)
    cart.total_amount = total_amount  # Update cart total amount
    db.session.commit()

    return jsonify({
        "message": "Dog removed from cart!",
        "cart_count": len(cart.cart_items),
        "total_amount": total_amount
    })

#************************************* route for order summary ***********************************************

@app.route("/order")
def order_summary():
    if "user_id" not in session:
        return redirect(url_for("login"))  # Redirect if user not logged in

    user_id = session["user_id"]

    # Fetch the user's cart
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart or not cart.cart_items:
        flash("Your cart is empty!", "warning")
        return redirect(url_for("cart_page"))  # Redirect to cart page if empty

    # Get cart items safely
    cart_items = [
        {
            "id": item.dog.dog_id if item.dog else None,
            "name": item.dog.name if item.dog else "Unknown",
            "breed": item.dog.breed if item.dog else "N/A",
            "age": item.dog.age if item.dog else "N/A",
            "price": item.dog.price if item.dog else 0,
            "image": item.dog.image if item.dog else "static/images/default.jpg"
        }
        for item in cart.cart_items if item.dog  # Ensure `dog` exists
    ]

    total_amount = sum(item["price"] for item in cart_items)  # Calculate total dynamically

    return render_template("order_summary.html", cart=cart_items, total_amount=total_amount)
    
#************************************* route for order confirm **********************************************

@app.route("/order-confirm", methods=["POST" , "GET"])
def order_confirm():
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401

    # Ensure request is JSON
    if not request.is_json:
        return jsonify({"error": "Invalid Content-Type. Expected application/json"}), 415

    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400

    address = f"{data.get('address')}, {data.get('city')}, {data.get('state')} - {data.get('zip')}"
    user_id = session["user_id"]
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart or not cart.cart_items:
        return jsonify({"error": "Your cart is empty!"}), 400

    # Calculate total amount
    total_amount = sum(item.dog.price for item in cart.cart_items)

    # Create a new order
    order = Order(user_id=user_id, total_amount=total_amount, shipping_address=address, payment_status=PaymentStatus.SUCCESS)
    db.session.add(order)
    db.session.commit()

    # Move cart items to order details
    for cart_item in cart.cart_items:
        order_item = OrderDetail(order_id=order.order_id, dog_id=cart_item.dog_id, quantity=cart_item.quantity)
        db.session.add(order_item)

    # Clear the cart after order confirmation
    CartItem.query.filter_by(cart_id=cart.cart_id).delete()
    db.session.delete(cart)
    db.session.commit()

    return jsonify({
        "message": "Order confirmed successfully!",
        "order_id": order.order_id  # Send redirect URL
    })

#************************************* route for log out ******************************************************
@app.route("/logout")
def logout():
    session.pop("user_id", None)  # Remove user_id from session
    return redirect("/login")

#*************************************** routes for service dashboard *******************************
@app.route('/services') # change name of the route to services from dashboard
def services():
    return render_template('Dashboard.html')


#*************************************** routes for fectching all services *******************************
@app.route('/api/services', methods=['GET']) # change name of the route to services from dashboard
def get_services():
    services = Service.query.all()
    services_data = [
        {
            "id": service.service_id,
            "name": service.service_name,
            "category": service.service_name.lower(),
            "description": service.service_description
        }
        for service in services
    ]
    return jsonify(services_data)


#*************************************** routes for service providers list *******************************
@app.route('/service-providers')
def service_providers():
    providers = ServiceProvider.query.filter_by(status=ServiceProviderStatus.ACCEPTED).all()
    return render_template('service_provider.html', providers=providers)


@app.route('/service-details/<service_id>')
def service_details(service_id):
    provider = ServiceProvider.query.get_or_404(service_id)
    # Convert the provider object to a dictionary
    provider_dict = {
        "name": provider.name,
        "service_name": provider.service_name,
        "address": provider.address,
        "hourly_rate": provider.hourly_rate,
        "experience": provider.experience,
        "description": provider.description,
        "status": provider.status.value,  # Convert Enum to string
        "document_folder": provider.document_folder
    }
    return render_template('service_details.html', provider=provider_dict)

#*************************************** routes for booking service providers *******************************
@app.route('/book-service', methods=['POST'])
def book_service():
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401  # Ensure user is logged in

    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Invalid data"}), 400  # Handle missing data

    user_id = session["user_id"]
    service_id = data.get("service_id")
    date = data.get("date")
    time = data.get("time")
    duration = int(data.get("duration"))
    
    # Ensure valid inputs
    if not service_id or not date or not time or not duration:
        return jsonify({"error": "Missing booking details"}), 400

    # Convert date and time to a proper format
    booking_datetime = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")

    # Calculate total cost
    provider = ServiceProvider.query.get_or_404(service_id)
    total_cost = provider.hourly_rate * duration

    # Store Booking in `booking` Table
    booking = Booking(
        user_id=user_id,
        booking_date=booking_datetime,
        duration=timedelta(hours=duration),
        total_cost=total_cost
    )
    db.session.add(booking)
    db.session.commit()

    # Store Booking Details in `booking_detail` Table
    booking_detail = BookingDetail(
        booking_id=booking.booking_id,
        service_name=provider.service_name,
        service_price=total_cost
    )
    db.session.add(booking_detail)
    db.session.commit()

    return jsonify({
        "message": "Booking confirmed successfully!",
        "booking_id": booking.booking_id,
        "total_cost": total_cost
    })


if __name__ == "__main__":
    app.run(debug=True)

#initial code