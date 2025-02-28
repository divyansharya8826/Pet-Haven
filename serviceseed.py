from models import app, db, Service

service = [
    {
        "service_name": "Grooming",
        "service_description": "Keep your furry friends looking and feeling their best with our professional grooming services. From bathing and brushing to nail trimming and stylish haircuts, we cater to all breeds and sizes. Our gentle and experienced groomers ensure a stress-free experience, leaving your pet clean, comfortable, and adorable.",
    },
    {
        "service_name": "Therapies",
        "service_description": "Enhance your pet's well-being with our specialized therapy services. We offer a range of holistic treatments including physiotherapy, hydrotherapy, and massage therapy designed to improve mobility, relieve pain, and promote relaxation. Our certified therapists provide personalized care tailored to your pet's specific needs."
    },
    {
        "service_name": "Health",
        "service_description": "Your pet's health is our top priority. Our comprehensive health services include regular check-ups, vaccinations, dental care, and nutritional guidance. Our experienced veterinarians are dedicated to ensuring your pet stays healthy and happy through every life stage, providing expert advice and compassionate care."
    },
    {
        "service_name": "Training",
        "service_description": "Set your pet up for success with our expert training programs. Whether it’s basic obedience, advanced skills, or behavior correction, our professional trainers use positive reinforcement techniques to help your pet learn and thrive. We offer individual sessions and group classes tailored to all breeds and ages."
    },
    {
        "service_name": "Spa",
        "service_description": "Treat your pet to a luxurious spa day! Our pet spa services go beyond regular grooming, offering soothing baths, fur conditioning treatments, pawdicures, and aromatherapy. Designed to pamper your pet, our spa experience promotes relaxation and leaves them feeling refreshed and rejuvenated."
    },
]

# inserting records in service table
with app.app_context():
    for s in service:
        new_service = Service(**s)
        db.session.add(new_service)

    db.session.commit()
    print("Database seeded successfully!")