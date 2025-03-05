// Data structure for dog services (list of objects)
const dogServices = [
    {
        category: "grooming",
        title: "Full Grooming Package",
        description: "Complete grooming service including bath, haircut, nail trimming, ear cleaning, and more.",
        benefits: [
            "Reduces shedding and matting",
            "Prevents skin issues",
            "Improves flea treatment",
            "Improves overall hygiene"
        ],
        duration: "60-90 minutes",
        price: "Rs.8000",
        icon: "https://png.pngtree.com/png-clipart/20230811/original/pngtree-dog-grooming-rgb-color-icon-beauty-help-grooming-vector-picture-image_10410932.png" // Replace with actual icon URL
    },
    {
        category: "grooming",
        title: "Bath & Brush",
        description: "Basic bath service with shampoo, conditioner, blow dry, and brushing.",
        benefits: [
            "Removes dirt and odor",
            "Distributes natural oils",
            "Detangles coat",
            "Includes ear cleaning"
        ],
        duration: "30-45 minutes",
        price: "Rs.5000",
        icon: "https://cdn-icons-png.flaticon.com/512/7078/7078977.png" // Replace with actual icon URL
    },
    {
        category: "grooming",
        title: "Nail Trim & Paw Care",
        description: "Professional nail trimming, paw pad moisturizing, and hair trimming between pads.",
        benefits: [
            "Prevents painful overgrowth",
            "Reduces risk of nail splitting",
            "Improves traction on slippery surfaces",
            "Includes paw massage"
        ],
        duration: "15-20 minutes",
        price: "Rs.4000",
        icon: "https://cdn-icons-png.flaticon.com/512/10753/10753855.png" // Replace with actual icon URL
    },
    {
        category: "therapy",
        title: "Behavioral Therapy",
        description: "Professional therapy to address anxiety, aggression, and behavioral issues in dogs.",
        benefits: [
            "Reduces anxiety and stress",
            "Improves obedience and socialization",
            "Customized training plans",
            "Supports emotional well-being"
        ],
        duration: "45-60 minutes",
        price: "Rs.5000",
        icon: "https://cdn-icons-png.flaticon.com/512/6381/6381442.png" // Replace with actual icon URL
    },
    {
        category: "health",
        title: "Health Check-Up",
        description: "Comprehensive health examination including vaccinations and parasite checks.",
        benefits: [
            "Early detection of health issues",
            "Up-to-date vaccinations",
            "Parasite prevention",
            "Detailed health report"
        ],
        duration: "30-45 minutes",
        price: "Rs.3000",
        icon: "https://cdn-icons-png.flaticon.com/512/5871/5871961.png" // Replace with actual icon URL
    },
    {
        category: "training",
        title: "Obedience Training",
        description: "Basic and advanced training for commands, leash walking, and behavior correction.",
        benefits: [
            "Teaches basic commands (sit, stay, come)",
            "Improves leash manners",
            "Addresses behavior problems",
            "Boosts confidence and bonding"
        ],
        duration: "45-60 minutes",
        price: "Rs.7000",
        icon: "https://cdn1.iconfinder.com/data/icons/dog-training/66/31-1024.png" // Replace with actual icon URL
    },
    {
        category: "spa",
        title: "Luxury Spa Treatment",
        description: "Relaxing spa experience with aromatherapy, massage, and premium grooming.",
        benefits: [
            "Reduces stress and tension",
            "Enhances coat shine and softness",
            "Includes calming aromatherapy",
            "Premium grooming products"
        ],
        duration: "60-90 minutes",
        price: "Rs.4000",
        icon: "https://static.vecteezy.com/system/resources/previews/021/467/974/non_2x/dogs-spa-icon-cartoon-dog-bath-vector.jpg" // Replace with actual icon URL
    }
];

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

// Function to generate service cards dynamically
function renderServices(category = 'all') {
    const servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.innerHTML = '';

    dogServices.forEach(service => {
        if (category === 'all' || service.category === category) {
            const card = document.createElement('div');
            card.className = `service-card ${service.category}`;
            card.setAttribute('data-category', service.category);

            card.innerHTML = `
                <span class="category">${service.category}</span>
                <img src="${service.icon}" alt="${service.title} Icon">
                <h2>${service.title}</h2>
                <p>${service.description}</p>
                <ul>
                    ${service.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
                <div class="duration">${service.duration}</div>
                <div class="price">${service.price}</div>
                <button class="book-btn">Book Now</button>
            `;

            servicesGrid.appendChild(card);
        }
    });

    // Add event listeners to new Book Now buttons
    document.querySelectorAll('.book-btn').forEach(button => {
        button.addEventListener('click', () => {
            alert(`Booking ${service.title} - Contact us for details!`);
        });
    });
}

// Tab filtering functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        const category = tab.getAttribute('data-category');
        renderServices(category);
    });
});

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderServices('all');

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