from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///petheaven.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# dogs table creation
class Dogs(db.Model):
    dog_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), nullable=False)
    breed = db.Column(db.String(60), nullable=False)
    age = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(200), nullable =False)

    def __repr__(self):
        print(self.name,self.breed)
        return f"<Dog {self.name} - {self.breed}>"
    

with app.app_context():
    db.create_all()