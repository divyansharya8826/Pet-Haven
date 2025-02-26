from email.policy import default
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
import uuid

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///petheaven.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ***************************************** User table creation ************************************************
class UserType(enum.Enum):
    OWNER = "Pet Owner"
    ADMIN = "Admin"
    SERVICEPROVIDER = "Service Provider"

class User(db.Model):
    user_id = db.Column(db.String(36), primary_key=True,
                        default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(60), unique=True, nullable=False)
    user_type = db.Column(db.Enum(UserType), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    # One-to-Many Relationships
    orders = db.relationship("Order", backref="user", lazy=True)
    carts = db.relationship("Cart", backref="user", lazy=True)
    bookings = db.relationship("Booking", backref="user", lazy=True)
    
    # one to one relationships
    provider = db.relationship("User", backref="service_providers", lazy=True)

# ****************************************** Dogs table creation *******************************************


class Dogs(db.Model):
    dog_id = db.Column(db.String(36), primary_key=True,
                       default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(60), nullable=False)
    breed = db.Column(db.String(60), nullable=False)
    age = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(200), nullable=False)

    orderdetails = db.relationship(
        "OrderDetails", uselist=True, backref="dogs", lazy=True)

    def __repr__(self):
        print(self.name, self.breed)
        return f"<Dog {self.name} - {self.breed}>"

# ****************************************** ServiceProvider table *******************************************
# Define Enum for Status


class ServiceProviderStatus(enum.Enum):
    PENDING = "Pending"
    ACCEPTED = "Accepted"
    REJECTED = "Rejected"


class ServiceProvider(db.Model):
    service_id = db.Column(db.String(36), primary_key=True,
                           default=lambda: str(uuid.uuid4()))
    provider_id = db.Column(db.String(36), ForeignKey("user.user_id"))
    name = db.Column(db.String(100), nullable=False)
    service_name = db.Column(db.String(60), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    hourly_rate = db.Column(db.Integer, nullable=False)
    experience = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Enum(ServiceProviderStatus),
                       default=ServiceProviderStatus.PENDING, nullable=False)
    document_folder = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<ServiceProvider {self.name}>"

# ****************************************** Booking table *******************************************


class Booking(db.Model):
    booking_id = db.Column(db.String(36), primary_key=True,
                           default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey(
        "user.user_id"), nullable=False)
    service_id = db.Column(db.String(36), ForeignKey(
        "serviceprovider.service_id"), nullable=False)
    booking_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    duration = db.Column(db.Time, nullable=False)
    total_cost = db.Column(db.Integer, nullable=False)

    booking_details = db.relationship(
        "BookingDetails", backref="booking", lazy=True)
    
    service_provider = db.relationship("ServiceProvider", backref="bookings", lazy=True)

    def __repr__(self):
        return f"<Booking {self.booking_id} - User {self.user_id}>"

# ****************************************** BookingDetails table *******************************************


class BookingDetails(db.Model):
    booking_detail_id = db.Column(
        db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = db.Column(db.String(36), db.ForeignKey(
        "booking.booking_id"), nullable=False)
    service_name = db.Column(db.String(100), nullable=False)
    service_price = db.Column(db.Integer, nullable=False)

    service = db.relationship("ServiceProvider", backref="booking_details", lazy=True)

    def __repr__(self):
        return f"<BookingDetails {self.booking_detail_id} - Booking {self.booking_id}>"

# ********************************************* order table creation *******************************************
class PaymentStatus(enum.Enum):
    PENDING = "Pending"
    SUCCESS = "Success"

class Order(db.Model):
    order_id = db.Column(db.String(36), primary_key=True,
                         default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), ForeignKey("user.user_id"), nullable=False)
    total_amount = db.Column(db.Integer, nullable=False)
    shipping_address = db.Column(db.String(255), nullable=False)
    payment_status = db.Column(db.Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    order_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    # one order can have multiple items
    orderdetails = db.relationship("OrderDetails", backref="order", lazy=True)

    def __repr__(self):
        print(self.order_id, self.total_amount)
        return f"<Order {self.order_id} - {self.total_amount}>"

# ***************************************** order_details table creation **************************************


class OrderDetails(db.Model):
    order_detail_id = db.Column(
        db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = db.Column(db.String(36), db.ForeignKey(
        "order.order_id"), nullable=False)
    dog_id = db.Column(db.String(36), db.ForeignKey(
        "dogs.dog_id"), nullable=True)
    booking_id = db.Column(db.String(36), ForeignKey(
        "booking.booking_id"), nullable=True)
    quantity = db.Column(db.Integer, nullable=False)

    # Relationship with Bookings (If exists)
    booking = db.relationship("Booking", backref="order_details", lazy=True)
    dog = db.relationship("Dogs", backref="order_details", lazy=True)

    def __repr__(self):
        print(self.order_detail_id, self.quantity)
        return f"<OrderDetails {self.order_detail_id} - {self.quantity}>"

# ************************************************* cart table creation **************************************


class Cart(db.Model):
    cart_id = db.Column(db.String(36), primary_key=True,
                        default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), ForeignKey("user.user_id"), nullable=False)
    total_amount = db.Column(db.Integer, nullable=False)
    order_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    # One-to-Many: A cart can have multiple items
    cart_items = db.relationship("CartItems", backref="cart", lazy=True)

    def __repr__(self):
        print(self.cart_id, self.total_amount)
        return f"<Cart {self.cart_id} - {self.total_amount}>"

# ******************************************** cart items table creation **************************************


class CartItems(db.Model):
    cart_item_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cart_id = db.Column(db.String(36), ForeignKey("cart.cart_id"), nullable=False)
    dog_id = db.Column(db.String(36), db.ForeignKey(
        "dogs.dog_id"), nullable=True)
    booking_id = db.Column(db.String(36), ForeignKey(
        "booking.booking_id"), nullable=True)
    quantity = db.Column(db.Integer, nullable=False)

    dog = db.relationship("Dogs", backref="cart_items", lazy=True)

    def __repr__(self):
        print(self.cart_item_id, self.quantity)
        return f"<CartItems {self.cart_item_id} - {self.quantity}>"


with app.app_context():
    db.create_all()
