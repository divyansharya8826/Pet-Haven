from model import app, db, Dogs

dogs = [
    { 'name': "Buddy", 'breed': "Labrador", 'age': "Puppy", 'price': 1500, 'image': "static/images/buddy.jpg" },
    { 'name': "Bella", 'breed': "Bulldog", 'age': "Adult", 'price': 2000, 'image': "static/images/bella.jpg" },
    { 'name': "Charlie", 'breed': "Poodle", 'age': "Senior", 'price': 1200, 'image': "static/images/charlie.jpg" },
    { 'name': "Max", 'breed': "Labrador", 'age': "Adult", 'price': 1800, 'image': "static/images/max.avif" },
    { 'name': "Lucy", 'breed': "Bulldog", 'age': "Puppy", 'price': 2200, 'image': "static/images/Lucy.webp" },
    { 'name': "Daisy", 'breed': "Poodle", 'age': "Adult", 'price': 2500, 'image': "static/images/daisy.jpg" },
]

with app.app_context():
    for dog in dogs:
        new_dog = Dogs(**dog)
        db.session.add(new_dog)

    db.session.commit()
    print("Database seeded successfully!")