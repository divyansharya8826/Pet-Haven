// Function for sidebar
function toggleSidebar() {
	const sidebar = document.getElementById('sidebar');
	const navbar = document.getElementById('navbar');
	const mainContent = document.getElementById('mainContent');

	if (sidebar.classList.contains('show')) {
		sidebar.classList.remove('show');
		navbar.style.left = '0';
		navbar.style.width = '100%';
		mainContent.style.marginLeft = '0';
	} else {
		sidebar.classList.add('show');
		navbar.style.left = '250px';
		navbar.style.width = 'calc(100% - 250px)';
		mainContent.style.marginLeft = '250px';
	}
}

// Function to fetch services from backend
async function fetchServices(category = 'all') {
    try {
        const response = await fetch('/api/services');
        const services = await response.json();
        renderServices(services, category);
    } catch (error) {
        console.error("Error fetching services:", error);
    }
}

// Function to generate service cards dynamically
function renderServices(services, category = 'all') {
    const servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.innerHTML = '';

    services.forEach(service => {
        if (category === 'all' || service.category === category) {
            const card = document.createElement('div');
            card.className = `service-card ${service.category}`;
            card.setAttribute('data-category', service.category);

            card.innerHTML = `
                <h2>${service.name}</h2>
                <p>${service.description}</p>
                <button class="book-btn" onclick="redirectToServiceProviders()">Book Now</button>
            `;

            servicesGrid.appendChild(card);
        }
    });

    // Add event listeners to new Book Now buttons
    document.querySelectorAll('.book-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const title = e.target.parentElement.querySelector("h2").innerText;
            alert(`Booking ${title}`);
        });
    });
}

// Function to navigate to the service providers page
function redirectToServiceProviders() {
    window.location.href = "/service-providers";
}

// Tab filtering functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        const category = tab.getAttribute('data-category');
        fetchServices(category);
    });
});

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    fetchServices('all');

    // Add animations on page load
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        card.style.opacity = 0;
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease-in';
            card.style.opacity = 1;
        }, index * 200);
    });
});