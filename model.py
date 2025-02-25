from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
import uuid

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///petheaven.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#****************************************** dogs table creation *******************************************
class Dogs(db.Model):
    dog_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(60), nullable=False)
    breed = db.Column(db.String(60), nullable=False)
    age = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(200), nullable =False)

    # orderdetails = db.relationship("OrderDetails", uselist=True, backref="dogs", lazy=True)

    def __repr__(self):
        print(self.name,self.breed)
        return f"<Dog {self.name} - {self.breed}>"
    
# # order table creation
# class Order(db.Model):
#     order_id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, ForeignKey("user.user_id"))
#     total_amount = db.Column(db.Integer, nullable=False)
#     shipping_address = db.Column(db.String(100), nullable=False)
#     payment_status = db.Column(db.String(30), nullable=False)
#     order_date = db.Column(db.DateTime, default=db.func.current_timestamp())

#     # one order can have multiple items
#     orderdetails = db.relationship("OrderDetails", backref="order", lazy=True)

#     def __repr__(self):
#         print(self.order_id,self.total_amount)
#         return f"<Order {self.order_id} - {self.total_amount}>"

# # order_details table creation
# class OrderDetails(db.Model):
#     order_detail_id = db.Column(db.Integer, primary_key=True)
#     order_id = db.Column(db.Integer, db.ForeignKey("order.order_id"), nullable=False)
#     dog_id = db.Column(db.Integer, ForeignKey("dogs.dog_id"), nullable=False)
#     appointment_id = db.Column(db.Integer, ForeignKey("user.booking_id"), nullable=False)
#     quantity = db.Column(db.Integer, nullable=False)

#     def __repr__(self):
#         print(self.order_detail_id,self.quantity)
#         return f"<OrderDetails {self.order_detail_id} - {self.quantity}>"

# # cart table creation
# class Cart(db.Model):
#     cart_id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, ForeignKey("user.user_id"), nullable=False)
#     total_amount = db.Column(db.Integer, nullable=False)
#     order_date = db.Column(db.DateTime, default=db.func.current_timestamp())

#     cartitems = db.relationship("CartItems", backref="cart", lazy=True)

#     def __repr__(self):
#         print(self.cart_id,self.total_amount)
#         return f"<Cart {self.cart_id} - {self.total_amount}>"

# # cart items table creation
# class CartItems(db.Model):
#     cart_item_id = db.Column(db.Integer, primary_key=True)
#     cart_id = db.Column(db.Integer, ForeignKey("cart.cart_id"), nullable=False)
#     dog_id = db.Column(db.Integer, ForeignKey("dogs.dog_id"), nullable=False)
#     appointment_id = db.Column(db.Integer, ForeignKey("user.booking_id"), nullable=False)
#     quantity = db.Column(db.Integer, nullable=False)

#     def __repr__(self):
#         print(self.cart_item_id,self.quantity)
#         return f"<CartItems {self.cart_item_id} - {self.quantity}>"

with app.app_context():
    db.create_all()