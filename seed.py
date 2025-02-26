from models import app, db, Dogs

# dogs = [
#     { 'name': "Buddy", 'breed': "Labrador", 'age': "Puppy", 'price': 1500, 'image': "static/images/buddy.jpg" },
#     { 'name': "Bella", 'breed': "Bulldog", 'age': "Adult", 'price': 2000, 'image': "static/images/bella.jpg" },
#     { 'name': "Charlie", 'breed': "Poodle", 'age': "Senior", 'price': 1200, 'image': "static/images/charlie.jpg" },
#     { 'name': "Max", 'breed': "Labrador", 'age': "Adult", 'price': 1800, 'image': "static/images/max.avif" },
#     { 'name': "Lucy", 'breed': "Bulldog", 'age': "Puppy", 'price': 2200, 'image': "static/images/Lucy.webp" },
#     { 'name': "Daisy", 'breed': "Poodle", 'age': "Adult", 'price': 2500, 'image': "static/images/daisy.jpg" },
# ]

dogs = [
    {"name": "Max", "breed": "Beagle", "age": "Young", "price": 7000, "image": "static/images/beagle.jpg"},
    {"name": "Charlie", "breed": "Labrador", "age": "Adult", "price": 9000, "image": "static/images/labrador.jpg"},
    {"name": "Rocky", "breed": "German Shepherd", "age": "Mature", "price": 12000, "image": "static/images/germanShepherd.jpg"},
    {"name": "Bella", "breed": "Poodle", "age": "Puppy", "price": 8000, "image": "static/images/poodle.jpg"},
    {"name": "Daisy", "breed": "Golden Retriever", "age": "Adult", "price": 11000, "image": "static/images/goldenretriever.jpg"},
    {"name": "Oscar", "breed": "Bulldog", "age": "Young", "price": 7500, "image": "static/images/bulldog.jpg"},
    {"name": "Lucy", "breed": "Shih Tzu", "age": "Puppy", "price": 6500, "image": "static/images/shihtzu.jpg"},
    {"name": "Milo", "breed": "Dachshund", "age": "Young", "price": 6800, "image": "static/images/dachshund.jpg"},
    {"name": "Bailey", "breed": "Rottweiler", "age": "Mature", "price": 13000, "image": "static/images/rottweiler.jpg"},
    {"name": "Teddy", "breed": "Pomeranian", "age": "Puppy", "price": 6000, "image": "static/images/pomeranian.jpg"},
    {"name": "Coco", "breed": "Husky", "age": "Adult", "price": 14000, "image": "static/images/husky.jpg"},
    {"name": "Buddy", "breed": "Dalmatian", "age": "Young", "price": 8500, "image": "static/images/dalmatian.jpg"},
    {"name": "Buster", "breed": "Border Collie", "age": "Mature", "price": 10000, "image": "static/images/border_collie.jpg"},
    {"name": "Duke", "breed": "Corgi", "age": "Puppy", "price": 9500, "image": "static/images/corgi.jpg"},
    {"name": "Zoe", "breed": "Samoyed", "age": "Adult", "price": 13500, "image": "static/images/samoyed.jpg"},
    {"name": "Luna", "breed": "Maltese", "age": "Young", "price": 7200, "image": "static/images/maltese.jpg"},
    {"name": "Hunter", "breed": "Doberman", "age": "Mature", "price": 12500, "image": "static/images/doberman.jpg"},
    {"name": "Rex", "breed": "Saint Bernard", "age": "Senior", "price": 15000, "image": "static/images/saintBernard.jpg"},
    {"name": "Lily", "breed": "Chihuahua", "age": "Puppy", "price": 5800, "image": "static/images/chihuahua.jpg"},
    {"name": "Jack", "breed": "Akita", "age": "Adult", "price": 11000, "image": "static/images/akita.jpg"},
    {"name": "Nala", "breed": "Great Dane", "age": "Mature", "price": 14500, "image": "static/images/greatDane.jpg"},
    {"name": "Leo", "breed": "Shiba Inu", "age": "Young", "price": 9500, "image": "static/images/shibainu.jpg"},
    {"name": "Jasper", "breed": "Alaskan Malamute", "age": "Adult", "price": 13000, "image": "static/images/alaskanMalamute.jpg"},
    {"name": "Penny", "breed": "Papillon", "age": "Young", "price": 6700, "image": "static/images/papillon.jpg"},
    {"name": "Benny", "breed": "Basset Hound", "age": "Adult", "price": 7700, "image": "static/images/bassethound.jpg"},
    {"name": "Nova", "breed": "Cane Corso", "age": "Mature", "price": 13700, "image": "static/images/caneCorso.jpg"},
    {"name": "Hazel", "breed": "Irish Setter", "age": "Adult", "price": 8800, "image": "static/images/irishSetter.jpg"},
    {"name": "Rusty", "breed": "Weimaraner", "age": "Young", "price": 9200, "image": "static/images/weimaraner.jpg"},
    {"name": "Sky", "breed": "Newfoundland", "age": "Senior", "price": 15500, "image": "static/images/newfoundland.jpg"},
    {"name": "Jasper", "breed": "Alaskan Malamute", "age": "Adult", "price": 13000, "image": "static/images/alaskanMalamute.jpg"},
    {"name": "Penny", "breed": "Papillon", "age": "Young", "price": 6700, "image": "static/images/papillon.jpg"},
    {"name": "Benny", "breed": "Basset Hound", "age": "Adult", "price": 7700, "image": "static/images/bassethound.jpg"},
    {"name": "Nova", "breed": "Cane Corso", "age": "Mature", "price": 13700, "image": "static/images/caneCorso.jpg"},
    {"name": "Hazel", "breed": "Irish Setter", "age": "Adult", "price": 8800, "image": "static/images/irishSetter.jpg"},
    {"name": "Rusty", "breed": "Weimaraner", "age": "Young", "price": 9200, "image": "static/images/weimaraner.jpg"},
    {"name": "Sky", "breed": "Newfoundland", "age": "Senior", "price": 15500, "image": "static/images/newfoundland.jpg"}
]

# inserting records in dogs table
with app.app_context():
    for dog in dogs:
        new_dog = Dogs(**dog)
        db.session.add(new_dog)

    db.session.commit()
    print("Database seeded successfully!")