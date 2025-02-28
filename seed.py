from models import app, db, Dogs

# dogs = [
#     { 'name': "Buddy", 'breed': "Labrador", 'age': "Puppy", 'price': 1500, 'image': "static/images/buddy.jpg", 'vaccinated': "Yes", 'description': "Friendly and energetic, loves to play and is great with families." },
#     { 'name': "Bella", 'breed': "Bulldog", 'age': "Adult", 'price': 2000, 'image': "static/images/bella.jpg", 'vaccinated': "Yes", 'description': "Loyal and protective, perfect for an indoor pet with moderate activity." },
#     { 'name': "Charlie", 'breed': "Poodle", 'age': "Senior", 'price': 1200, 'image': "static/images/charlie.jpg", 'vaccinated': "Yes", 'description': "Intelligent and obedient, enjoys companionship and learning new tricks." },
#     { 'name': "Max", 'breed': "Labrador", 'age': "Adult", 'price': 1800, 'image': "static/images/max.avif", 'vaccinated': "Yes", 'description': "Labradors are loving and sociable, ideal for families and outdoor activities." },
#     { 'name': "Lucy", 'breed': "Bulldog", 'age': "Puppy", 'price': 2200, 'image': "static/images/Lucy.webp", 'vaccinated': "No", 'description': "Playful and affectionate, enjoys snuggling and short walks." },
#     { 'name': "Daisy", 'breed': "Poodle", 'age': "Adult", 'price': 2500, 'image': "static/images/daisy.jpg", 'vaccinated': "Yes", 'description': "Lively and intelligent, thrives on mental stimulation and companionship." },
#     { 'name': "Max", 'breed': "Beagle", 'age': "Young", 'price': 7000, 'image': "static/images/beagle.jpg", 'vaccinated': "No", 'description': "Curious and energetic, Beagles are great scent hounds and family pets." },
#     { 'name': "Charlie", 'breed': "Labrador", 'age': "Adult", 'price': 9000, 'image': "static/images/labrador.jpg", 'vaccinated': "Yes", 'description': "Loyal and friendly, loves swimming and fetching games." },
#     { 'name': "Rocky", 'breed': "German Shepherd", 'age': "Mature", 'price': 12000, 'image': "static/images/germanShepherd.jpg", 'vaccinated': "Yes", 'description': "Intelligent and protective, excellent as a guard dog and working companion." },
#     { 'name': "Bella", 'breed': "Poodle", 'age': "Puppy", 'price': 8000, 'image': "static/images/poodle.jpg", 'vaccinated': "No", 'description': "Charming and elegant, Poodles are highly trainable and affectionate." },
#     { 'name': "Daisy", 'breed': "Golden Retriever", 'age': "Adult", 'price': 11000, 'image': "static/images/goldenretriever.jpg", 'vaccinated': "Yes", 'description': "Loyal and loving, enjoys outdoor activities and socializing with humans." },
#     { 'name': "Oscar", 'breed': "Bulldog", 'age': "Young", 'price': 7500, 'image': "static/images/bulldog.jpg", 'vaccinated': "No", 'description': "Calm and dignified, Bulldogs are easy-going and affectionate pets." },
#     { 'name': "Lucy", 'breed': "Shih Tzu", 'age': "Puppy", 'price': 6500, 'image': "static/images/shihtzu.jpg", 'vaccinated': "Yes", 'description': "Sweet and friendly, perfect for small living spaces and gentle playtime." },
#     { 'name': "Milo", 'breed': "Dachshund", 'age': "Young", 'price': 6800, 'image': "static/images/dachshund.jpg", 'vaccinated': "Yes", 'description': "Brave and curious, Dachshunds are great for adventurous and playful owners." },
#     { 'name': "Bailey", 'breed': "Rottweiler", 'age': "Mature", 'price': 13000, 'image': "static/images/rottweiler.jpg", 'vaccinated': "Yes", 'description': "Strong and confident, Rottweilers are excellent guard dogs and family protectors." },
#     { 'name': "Teddy", 'breed': "Pomeranian", 'age': "Puppy", 'price': 6000, 'image': "static/images/pomeranian.jpg", 'vaccinated': "No", 'description': "Tiny but bold, Pomeranians are playful, energetic, and love attention." },
#     { 'name': "Coco", 'breed': "Husky", 'age': "Adult", 'price': 14000, 'image': "static/images/husky.jpg", 'vaccinated': "Yes", 'description': "Energetic and independent, Huskies thrive in active households." },
#     { 'name': "Buddy", 'breed': "Dalmatian", 'age': "Young", 'price': 8500, 'image': "static/images/dalmatian.jpg", 'vaccinated': "Yes", 'description': "Dalmatians are playful and athletic, with a striking spotted coat." },
#     { 'name': "Buster", 'breed': "Border Collie", 'age': "Mature", 'price': 10000, 'image': "static/images/border_collie.jpg", 'vaccinated': "Yes", 'description': "Highly intelligent and active, ideal for training and herding activities." },
#     { 'name': "Duke", 'breed': "Corgi", 'age': "Puppy", 'price': 9500, 'image': "static/images/corgi.jpg", 'vaccinated': "No", 'description': "Short but sturdy, Corgis are playful, friendly, and great companions." },
#     { 'name': "Zoe", 'breed': "Samoyed", 'age': "Adult", 'price': 13500, 'image': "static/images/samoyed.jpg", 'vaccinated': "Yes", 'description': "Fluffy and friendly, Samoyeds are gentle giants who love people." },
#     { 'name': "Luna", 'breed': "Maltese", 'age': "Young", 'price': 7200, 'image': "static/images/maltese.jpg", 'vaccinated': "Yes", 'description': "Elegant and affectionate, Maltese dogs are ideal lap dogs and companions." },
#     { 'name': "Hunter", 'breed': "Doberman", 'age': "Mature", 'price': 12500, 'image': "static/images/doberman.jpg", 'vaccinated': "Yes", 'description': "Athletic and protective, Dobermans are intelligent and loyal guardians." },
#     { 'name': "Rex", 'breed': "Saint Bernard", 'age': "Senior", 'price': 15000, 'image': "static/images/saintBernard.jpg", 'vaccinated': "Yes", 'description': "Gentle giants, Saint Bernards are affectionate and protective family dogs." },
#     { 'name': "Lily", 'breed': "Chihuahua", 'age': "Puppy", 'price': 5800, 'image': "static/images/chihuahua.jpg", 'vaccinated': "No", 'description': "Small and lively, Chihuahuas are feisty companions with big personalities." },
#     { 'name': "Jack", 'breed': "Akita", 'age': "Adult", 'price': 11000, 'image': "static/images/akita.jpg", 'vaccinated': "Yes", 'description': "Strong and dignified, Akitas are fiercely loyal and protective." },
#     { 'name': "Nala", 'breed': "Great Dane", 'age': "Mature", 'price': 14500, 'image': "static/images/greatDane.jpg", 'vaccinated': "Yes", 'description': "Gentle giants, Great Danes are friendly and affectionate family pets." },
# ]

dogs = [
    {
        "name": "Leo",
        "breed": "Shiba Inu",
        "age": "Young",
        "price": 9500,
        "image": "static/images/shibainu.jpg",
        "vaccinated": "Yes",
        "description": "Leo is an energetic and intelligent Shiba Inu who loves to explore. With his playful nature and strong personality, he's perfect for active owners."
    },
    {
        "name": "Jasper",
        "breed": "Alaskan Malamute",
        "age": "Adult",
        "price": 13000,
        "image": "static/images/alaskanMalamute.jpg",
        "vaccinated": "Yes",
        "description": "Jasper is a strong and friendly Alaskan Malamute. He enjoys cold weather, long hikes, and spending time with his family."
    },
    {
        "name": "Penny",
        "breed": "Papillon",
        "age": "Young",
        "price": 6700,
        "image": "static/images/papillon.jpg",
        "vaccinated": "No",
        "description": "Penny is a small but lively Papillon with a friendly and affectionate personality. She loves to play and is highly trainable."
    },
    {
        "name": "Benny",
        "breed": "Basset Hound",
        "age": "Adult",
        "price": 7700,
        "image": "static/images/bassethound.jpg",
        "vaccinated": "Yes",
        "description": "Benny is a calm and lovable Basset Hound. With his droopy ears and soulful eyes, he's perfect for families who love gentle and affectionate dogs."
    },
    {
        "name": "Nova",
        "breed": "Cane Corso",
        "age": "Mature",
        "price": 13700,
        "image": "static/images/caneCorso.jpg",
        "vaccinated": "Yes",
        "description": "Nova is a powerful and protective Cane Corso, perfect for experienced dog owners looking for a loyal guardian."
    },
    {
        "name": "Hazel",
        "breed": "Irish Setter",
        "age": "Adult",
        "price": 8800,
        "image": "static/images/irishSetter.jpg",
        "vaccinated": "No",
        "description": "Hazel is a graceful and energetic Irish Setter, known for her affectionate personality and love for running in open fields."
    },
    {
        "name": "Rusty",
        "breed": "Weimaraner",
        "age": "Young",
        "price": 9200,
        "image": "static/images/weimaraner.jpg",
        "vaccinated": "Yes",
        "description": "Rusty is a sleek and athletic Weimaraner, always ready for adventure. He’s a great companion for active families."
    },
    {
        "name": "Sky",
        "breed": "Newfoundland",
        "age": "Senior",
        "price": 15500,
        "image": "static/images/newfoundland.jpg",
        "vaccinated": "Yes",
        "description": "Sky is a gentle and loving Newfoundland, known for his calm demeanor and excellent swimming ability. Great for families with kids."
    }
]

# inserting records in dogs table
with app.app_context():
    for dog in dogs:
        new_dog = Dogs(**dog)
        db.session.add(new_dog)

    db.session.commit()
    print("Database seeded successfully!")