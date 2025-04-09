# My Flask Application

This is a basic full-stack web application built using Flask, HTML, CSS, and JavaScript.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Python 3.7+:** Make sure you have Python 3.7 or a later version installed. You can check your Python version by running `python --version` or `python3 --version` in your terminal.
- **pip:** The Python package installer. It usually comes bundled with Python. You can verify its installation by running `pip --version`.
- **Git (Optional but Recommended):** For cloning the repository. If you don't have Git, you can download the project as a ZIP file.



# Pet Haven

Pet Haven is a comprehensive pet shop and service management web application built with Flask. It allows users to browse and purchase dogs, book pet services, and manage their cart and orders.

## Features

### For Pet Adoption
- Browse a catalog of dogs with detailed information
- Advanced filtering by breed, age, and price
- Search functionality for finding specific dogs
- Add dogs to cart and checkout

### For Pet Services
- Browse available pet services (grooming, training, etc.)
- View service provider details and qualifications
- Book services with specific providers
- Select date and time for appointments
- Real-time cost calculation based on service duration

### Shopping Experience
- Cart management for both pets and services
- Order summary and confirmation
- Clean and intuitive checkout process
- Responsive notifications for user actions

### User Interface
- Responsive design for all device sizes
- Modern and minimal UI with intuitive navigation
- Real-time feedback for user interactions
- Consistent styling across all pages

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- Responsive design with Flexbox and Grid
- Font Awesome for icons
- Custom notification system

### Backend
- Flask web framework
- SQLAlchemy ORM for database operations
- Flask Session for user state management
- RESTful API endpoints

### Database
- SQLite for development
- Models for Users, Dogs, Services, Carts, and Orders

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- *Python 3.7+:* Make sure you have Python 3.7 or a later version installed.
- *pip:* The Python package installer.
- *Git (Optional):* For cloning the repository.

### Installation

1. Clone the repository (or download as ZIP):
   
   git clone https://github.com/yourusername/Pet-Haven.git
   cd Pet-Haven
   

2. Create and activate a virtual environment:
   
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   

3. Install the required packages:
   
   pip install -r requirements.txt
   

4. Set up the database:
   
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   

5. Run the application:
   
   python app.py
   

6. Open your browser and navigate to http://localhost:5000

## Project Structure

- /static - Static files (CSS, JavaScript, images)
- /templates - HTML templates
- /models - Database models
- routes.py - Application routes and API endpoints
- app.py - Application entry point

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Flask team for the excellent web framework
- The open-source community for inspiration and resources