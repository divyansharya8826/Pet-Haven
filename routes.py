from flask import Flask, jsonify, render_template
import os
from model import app, db, Dogs


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

if __name__ == "__main__":
    app.run(debug=True)