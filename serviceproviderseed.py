from models import ServiceProvider, app, db, ServiceProviderStatus

# List of service providers
service_providers = [
    {"name": "John Smith", "service_name": "Dog Grooming", "address": "123 Pet Street, NY", "hourly_rate": 500, "experience": "5 years", "description": "Professional dog grooming services.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/john_smith_docs"},
    {"name": "Emily Davis", "service_name": "Veterinary Care", "address": "456 Healthy Pets Ave, CA", "hourly_rate": 1000, "experience": "8 years", "description": "Certified veterinary specialist.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/emily_davis_docs"},
    {"name": "Michael Johnson", "service_name": "Pet Sitting", "address": "789 Cozy Lane, TX", "hourly_rate": 300, "experience": "3 years", "description": "Reliable pet sitting service at your home.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/michael_johnson_docs"},
    {"name": "Sarah Brown", "service_name": "Dog Training", "address": "101 Training Blvd, FL", "hourly_rate": 700, "experience": "6 years", "description": "Expert in obedience and behavior training.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/sarah_brown_docs"},
    {"name": "David Wilson", "service_name": "Pet Boarding", "address": "202 Safe Haven, IL", "hourly_rate": 600, "experience": "4 years", "description": "Safe and comfortable boarding services.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/david_wilson_docs"},
    {"name": "Jessica Taylor", "service_name": "Pet Photography", "address": "303 Pawsome St, CO", "hourly_rate": 800, "experience": "7 years", "description": "Professional pet photography sessions.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/jessica_taylor_docs"},
    {"name": "Daniel Martinez", "service_name": "Dog Walking", "address": "404 Walkway, WA", "hourly_rate": 200, "experience": "2 years", "description": "Daily walks for dogs of all sizes.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/daniel_martinez_docs"},
    {"name": "Laura Anderson", "service_name": "Pet Grooming", "address": "505 Fluffy Road, NJ", "hourly_rate": 550, "experience": "4 years", "description": "Affordable and friendly pet grooming.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/laura_anderson_docs"},
    {"name": "Robert King", "service_name": "Exotic Pet Care", "address": "606 Wild Ave, OR", "hourly_rate": 1200, "experience": "9 years", "description": "Specialized care for exotic pets.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/robert_king_docs"},
    {"name": "Sophia Lopez", "service_name": "Dog Training", "address": "707 Bark Lane, GA", "hourly_rate": 750, "experience": "5 years", "description": "Puppy training and behavior correction.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/sophia_lopez_docs"},
    {"name": "Ethan Parker", "service_name": "Pet Taxi", "address": "808 Ride Blvd, TX", "hourly_rate": 350, "experience": "3 years", "description": "Safe transportation for your pets.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/ethan_parker_docs"},
    {"name": "Olivia Hall", "service_name": "Dog Therapy", "address": "909 Calm St, MA", "hourly_rate": 950, "experience": "6 years", "description": "Therapeutic sessions for dogs with anxiety.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/olivia_hall_docs"},
    {"name": "Lucas Scott", "service_name": "Pet Rehabilitation", "address": "1001 Heal Dr, AZ", "hourly_rate": 1100, "experience": "10 years", "description": "Rehabilitation services for injured pets.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/lucas_scott_docs"},
    {"name": "Ella Walker", "service_name": "Pet Nutritionist", "address": "1112 Wellness Rd, CA", "hourly_rate": 900, "experience": "7 years", "description": "Customized diet plans for pets.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/ella_walker_docs"},
    {"name": "Henry Carter", "service_name": "Fish Tank Maintenance", "address": "1213 Aqua St, NY", "hourly_rate": 450, "experience": "5 years", "description": "Aquarium cleaning and maintenance.", "status": ServiceProviderStatus.ACCEPTED, "document_folder": "static/documents/henry_carter_docs"}
]

# Insert data into the database
with app.app_context():
    for provider in service_providers:
        new_provider = ServiceProvider(
            name=provider["name"],
            service_name=provider["service_name"],
            address=provider["address"],
            hourly_rate=provider["hourly_rate"],
            experience=provider["experience"],
            description=provider["description"],
            status=provider["status"],  # Convert string to Enum
            document_folder=provider["document_folder"]
        )
        db.session.add(new_provider)
    
    db.session.commit()
    print("Service providers added successfully!")