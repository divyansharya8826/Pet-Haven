from flask import Flask, jsonify, render_template, request, session, redirect, url_for, flash
import os
from models import app, db, Dogs, Cart, CartItem, Order, OrderDetail, Service, ServiceProvider, ServiceProviderStatus, PaymentStatus, Booking, BookingDetail
import uuid
from flask import render_template, jsonify
from models import ServiceProvider
from datetime import datetime
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
        # Pass any query parameters to the template to allow for order success notifications
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
        return render_template("cart.html", cart=[], total_price=0)

    # Fetch Dog Items in Cart
    cart_dogs = [
        {
            "id": item.dog.dog_id,
            "name": item.dog.name,
            "breed": item.dog.breed,
            "age": item.dog.age,
            "price": item.dog.price,
            "image": item.dog.image,
            "type": "dog"
        }
        for item in cart.cart_items if item.dog
    ]

    # Fetch Booking Items in Cart
    cart_bookings = [
        {
            "id": item.booking.booking_id,
            "service_name": item.booking.booking_details[0].service_name if item.booking.booking_details else "Unknown Service",  # Assuming Booking model has service_name
            "provider_id": item.booking.booking_details[0].service_id,     # Assuming provider details exist
            "date": item.booking.booking_date.strftime("%Y-%m-%d"),
            "duration": str(item.booking.duration),  
            "total_cost": item.booking.total_cost,
            "image": "static/images/istockphoto-1154973359-612x612.jpg",  # Placeholder image
            "type": "booking"
        }
        for item in cart.cart_items if item.booking
    ]

    print("Cart Dogs:", cart_dogs)
    print("Cart Bookings:", cart_bookings)
    # Combine dogs & bookings in one list
    cart_items = cart_dogs + cart_bookings
    total_price = sum(item["price"] if item["type"] == "dog" else item["total_cost"] for item in cart_items)

    return render_template("cart.html", cart=cart_items, total_price=total_price)

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

    # Fetch Dog Items in Order
    cart_dogs = [
        {
            "id": item.dog.dog_id,
            "name": item.dog.name,
            "breed": item.dog.breed,
            "price": item.dog.price,
            "image": item.dog.image,
            "type": "dog"
        }
        for item in cart.cart_items if item.dog
    ]

    # Fetch Booking Items in Order
    cart_bookings = [
        {
            "id": item.booking.booking_id,
            "service_name": item.booking.booking_details[0].service_name if item.booking.booking_details else "Unknown Service",
            "provider_id": item.booking.booking_details[0].service_id,
            "date": item.booking.booking_date.strftime("%Y-%m-%d"),
            "duration": item.booking.duration,
            "total_cost": item.booking.total_cost,
            "image": "static/images/istockphoto-1154973359-612x612.jpg",
            "type": "booking"
        }
        for item in cart.cart_items if item.booking
    ]

    cart_items = cart_dogs + cart_bookings

    return jsonify({"cart": cart_items})

#******************************** route for add to cart functionality ***************************************
@app.route("/cart/add", methods=['POST'])
def add_to_cart():
    print("Add to cart request received")
    
    # Check if user is logged in
    if "user_id" not in session:
        print("User not logged in")
        return jsonify({"error": "User not logged in"}), 401

    try:
        data = request.get_json()
        if not data:
            print("No data provided in request")
            return jsonify({"error": "Invalid request - no data provided"}), 400
            
        dog_id = data.get("dog_id")
        booking_id = data.get("booking_id")
        user_id = session["user_id"]  # Fetch user_id from session

        print(f"Adding to cart - user_id: {user_id}, dog_id: {dog_id}, booking_id: {booking_id}")

        if not dog_id and not booking_id:
            print("No dog_id or booking_id provided")
            return jsonify({"error": "Invalid request - no dog_id or booking_id provided"}), 400

        # Check if the user already has a cart
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            print(f"Creating new cart for user {user_id}")
            cart = Cart(user_id=user_id, total_amount=0)
            db.session.add(cart)
            db.session.commit()
            print(f"Created new cart with ID: {cart.cart_id}")

        if dog_id:
            # Check if the dog is already in the cart
            cart_item = CartItem.query.filter_by(cart_id=cart.cart_id, dog_id=dog_id).first()
            if cart_item:
                print(f"Dog {dog_id} already in cart")
                return jsonify({"message": "Dog already in cart!", "cart_count": len(cart.cart_items)})

            # Check if dog exists
            dog = Dogs.query.get(dog_id)
            if not dog:
                print(f"Dog {dog_id} not found")
                return jsonify({"error": f"Dog with id {dog_id} not found"}), 404

            # Add dog to cart
            cart_item = CartItem(cart_id=cart.cart_id, dog_id=dog_id)
            db.session.add(cart_item)
            print(f"Added dog {dog_id} to cart {cart.cart_id}")

        elif booking_id:
            print(f"Processing booking_id: {booking_id}, type: {type(booking_id)}")
            
            # Verify booking exists
            booking = Booking.query.get(booking_id)
            if not booking:
                print(f"Booking {booking_id} not found")
                return jsonify({"error": f"Booking with id {booking_id} not found"}), 404
                
            # Check if booking belongs to user
            if booking.user_id != user_id:
                print(f"Booking {booking_id} belongs to user {booking.user_id}, not current user {user_id}")
                return jsonify({"error": "Unauthorized to add this booking to cart"}), 403
                
            # Check if the booking is already in the cart
            cart_item = CartItem.query.filter_by(cart_id=cart.cart_id, booking_id=booking_id).first()
            if cart_item:
                print(f"Booking {booking_id} already in cart")
                return jsonify({"message": "Booking already in cart!", "cart_count": len(cart.cart_items)})
                
            # Add booking to cart
            cart_item = CartItem(cart_id=cart.cart_id, booking_id=booking_id)
            db.session.add(cart_item)
            print(f"Added booking {booking_id} to cart {cart.cart_id}")
        
        db.session.commit()
        
        cart_count = len(cart.cart_items)
        print(f"Cart now has {cart_count} items")

        if dog_id:
            return jsonify({"message": "Dog added successfully!", "cart_count": cart_count})
        elif booking_id:
            return jsonify({"message": "Booking added successfully!", "cart_count": cart_count})
            
    except Exception as e:
        db.session.rollback()
        print(f"Error adding to cart: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to add to cart: {str(e)}"}), 500

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

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request - no data provided"}), 400
            
        user_id = session["user_id"]

        # Find the user's cart
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            return jsonify({"error": "Cart not found"}), 404
        
        cart_item = None
        
        # Remove Dog from Cart
        if "dog_id" in data:
            dog_id = data["dog_id"]
            cart_item = CartItem.query.filter_by(cart_id=cart.cart_id, dog_id=dog_id).first()
            if cart_item:
                print(f"Removing dog {dog_id} from cart {cart.cart_id}")

        # Remove Booking from Cart
        elif "booking_id" in data:
            booking_id = data["booking_id"]
            cart_item = CartItem.query.filter_by(cart_id=cart.cart_id, booking_id=booking_id).first()
            if cart_item:
                print(f"Removing booking {booking_id} from cart {cart.cart_id}")
        else:
            return jsonify({"error": "Invalid request - no dog_id or booking_id provided"}), 400

        if not cart_item:
            return jsonify({"error": "Item not found in cart"}), 404
            
        # Delete the cart item
        db.session.delete(cart_item)
        db.session.commit()
        
        # Get updated cart items to calculate total
        cart_items = []
        
        # Fetch Dog Items in Cart
        for item in cart.cart_items:
            if item.dog:
                cart_items.append({"price": item.dog.price, "type": "dog"})
            elif item.booking:
                cart_items.append({"total_cost": item.booking.total_cost, "type": "booking"})
        
        # Recalculate total amount
        total_amount = sum(item["price"] if item["type"] == "dog" else item["total_cost"] for item in cart_items)
        cart.total_amount = total_amount  # Update cart total amount
        db.session.commit()
        
        cart_count = len(cart.cart_items)
        print(f"Cart now has {cart_count} items with total amount {total_amount}")

        return jsonify({
            "message": "Item removed from cart!",
            "cart_count": cart_count,
            "total_amount": total_amount
        })
    
    except Exception as e:
        db.session.rollback()
        print(f"Error removing from cart: {str(e)}")
        return jsonify({"error": f"Failed to remove from cart: {str(e)}"}), 500

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
    
    # Fetch Dog Items in Order
    cart_dogs = [
        {
            "id": item.dog.dog_id,
            "name": item.dog.name,
            "breed": item.dog.breed,
            "price": item.dog.price,
            "image": item.dog.image,
            "type": "dog"
        }
        for item in cart.cart_items if item.dog
    ]

    # Fetch Booking Items in Order
    cart_bookings = [
        {
            "id": item.booking.booking_id,
            "service_name": item.booking.booking_details[0].service_name if item.booking.booking_details else "Unknown Service",
            "provider_id": item.booking.booking_details[0].service_id,
            "date": item.booking.booking_date.strftime("%Y-%m-%d"),
            "duration": item.booking.duration,
            "total_cost": item.booking.total_cost,
            "image": "static/images/istockphoto-1154973359-612x612.jpg",
            "type": "booking"
        }
        for item in cart.cart_items if item.booking
    ]

    
    cart_items = cart_dogs + cart_bookings
    total_amount = sum(item["price"] if item["type"] == "dog" else item["total_cost"] for item in cart_items)  # Calculate total dynamically

    return render_template("order_summary.html", cart=cart_items, total_amount=total_amount)
    
#************************************* route for order confirm **********************************************

@app.route("/order-confirm", methods=["POST"])
def order_confirm():
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401

    # Ensure request is JSON
    if not request.is_json:
        return jsonify({"error": "Invalid Content-Type. Expected application/json"}), 415

    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400

    try:
        address = f"{data.get('address')}, {data.get('city')}, {data.get('state')} - {data.get('zip')}"
        user_id = session["user_id"]
        cart = Cart.query.filter_by(user_id=user_id).first()

        if not cart or not cart.cart_items:
            return jsonify({"error": "Your cart is empty!"}), 400

        # Calculate total amount
        total_amount = sum(item.dog.price if item.dog else item.booking.total_cost for item in cart.cart_items)

        # Create a new order
        order = Order(user_id=user_id, total_amount=total_amount, shipping_address=address, payment_status=PaymentStatus.SUCCESS)
        db.session.add(order)
        db.session.commit()

        # Move cart items to order details
        for cart_item in cart.cart_items:
            order_item = OrderDetail(order_id=order.order_id, dog_id=cart_item.dog_id, booking_id=cart_item.booking_id, quantity=cart_item.quantity)
            db.session.add(order_item)

        db.session.commit()
        # Clear the cart after order confirmation
        CartItem.query.filter_by(cart_id=cart.cart_id).delete()
        db.session.delete(cart)
        db.session.commit()

        return jsonify({
            "message": "Order confirmed successfully!",
            "order_id": order.order_id  # Send redirect URL
        })

    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"error": str(e)}), 500

#************************************* route for order confirmation page get request **************************************

@app.route("/order-confirm", methods=["GET"])
def order_confirm_page():
    if "user_id" not in session:
        return redirect(url_for("login"))  # Redirect if user not logged in

    order_id = request.args.get("order_id")  # Get order_id from query parameters
    if not order_id:
        flash("Invalid order ID!", "error")
        return redirect(url_for("home"))  # Redirect to home if no order_id

    # Fetch the order details from the database
    order = Order.query.filter_by(order_id=order_id, user_id=session["user_id"]).first()
    if not order:
        flash("Order not found!", "error")
        return redirect(url_for("home"))  # Redirect if order not found

    # Fetch Dog Items in Order
    order_dogs = [
        {
            "id": item.dog.dog_id,
            "name": item.dog.name,
            "breed": item.dog.breed,
            "price": item.dog.price,
            "image": item.dog.image,
            "type": "dog"
        }
        for item in order.order_details if item.dog
    ]

    # Fetch Booking Items in Order
    order_bookings = [
        {
            "id": item.booking.booking_id,
            "service_name": item.booking.booking_details[0].service_name if item.booking.booking_details else "Unknown Service",
            "provider_id": item.booking.booking_details[0].service_id,
            "date": item.booking.booking_date.strftime("%Y-%m-%d"),
            "duration": item.booking.duration,
            "total_cost": item.booking.total_cost,
            "image": "static/images/istockphoto-1154973359-612x612.jpg",
            "type": "booking"
        }
        for item in order.order_details if item.booking
    ]

    # Combine into a single list
    order_items = order_dogs + order_bookings
    print("Order Items:", order_items)
    total_price = sum(item["price"] if item["type"] == "dog" else item["total_cost"] for item in order_items)

    return render_template("order_confirm.html", cart=order_items, total_price=total_price)

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
        "service_id": provider.service_id,
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
    print("Book service request received")
    
    # Check if user is logged in
    if "user_id" not in session:
        print("User not logged in")
        return jsonify({"error": "User not logged in"}), 401  # Ensure user is logged in

    try:
        data = request.get_json()
        
        if not data:
            print("No data provided in request")
            return jsonify({"error": "Invalid data"}), 400  # Handle missing data

        user_id = session["user_id"]
        print(f"Processing booking for user: {user_id}")
        
        service_id = data.get("service_id")
        date = data.get("date")
        time = data.get("time")
        duration = data.get("duration")
        total_cost = data.get("totalCost")
        
        print(f"Booking details: service_id={service_id}, date={date}, time={time}, duration={duration}, cost={total_cost}")
        
        # Ensure valid inputs
        if not all([service_id, date, time, duration, total_cost]):
            missing = []
            if not service_id: missing.append("service_id")
            if not date: missing.append("date")
            if not time: missing.append("time")
            if not duration: missing.append("duration")
            if not total_cost: missing.append("total_cost")
            print(f"Missing booking details: {', '.join(missing)}")
            return jsonify({"error": f"Missing booking details: {', '.join(missing)}"}), 400

        # Convert strings to appropriate types
        try:
            duration = int(duration)
            total_cost = int(total_cost)
        except (ValueError, TypeError) as e:
            print(f"Type conversion error: {str(e)}")
            return jsonify({"error": f"Invalid data format: {str(e)}"}), 400

        # Verify the service provider exists
        provider = ServiceProvider.query.get(service_id)
        if not provider:
            print(f"Service provider not found: {service_id}")
            return jsonify({"error": "Service provider not found"}), 404

        # Convert date and time to a proper format
        try:
            booking_datetime = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
            print(f"Parsed datetime: {booking_datetime}")
        except ValueError as e:
            print(f"Date/time parsing error: {str(e)}")
            return jsonify({"error": f"Invalid date or time format: {str(e)}"}), 400

        # Store Booking in `booking` Table
        booking = Booking(
            user_id=user_id,
            booking_date=booking_datetime,
            duration=duration,
            total_cost=total_cost
        )
        db.session.add(booking)
        db.session.commit()
        print(f"Created booking with ID: {booking.booking_id}")

        # Store Booking Details in `booking_detail` Table
        booking_detail = BookingDetail(
            booking_id=booking.booking_id,
            service_id=service_id,
            user_id=user_id,
            service_name=provider.service_name,
            service_price=total_cost
        )
        db.session.add(booking_detail)
        db.session.commit()
        print(f"Created booking detail with ID: {booking_detail.booking_detail_id}")

        return jsonify({
            "message": "Booking confirmed successfully!",
            "booking_id": booking.booking_id,
            "total_cost": total_cost
        })
    
    except Exception as e:
        db.session.rollback()
        print(f"Error in book_service: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to create booking: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)

#initial code