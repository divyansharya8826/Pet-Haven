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

const providerDataElement = document.getElementById('provider-data');
const provider = JSON.parse(providerDataElement.textContent);

// Review Data (still hardcoded for now)
const reviews = [
    {
        text: "An absolutely luxurious experience for my pup! The attention to detail is unmatched.",
        reviewer: "Sarah L.",
        rating: 5
    },
    {
        text: "John's expertise shines through. My dog has never looked better!",
        reviewer: "Mike T.",
        rating: 4.5
    },
    {
        text: "Premium service worth every penny. Exceptional quality and care.",
        reviewer: "Emma R.",
        rating: 4
    }
];

// Render Service Details
function renderServiceDetails() {
    const serviceDetails = document.getElementById('serviceDetails');
    serviceDetails.innerHTML = `
        <p><strong>Provider</strong><br>${provider.name}</p>
        <p><strong>Location</strong><br>${provider.address}</p>
        <p><strong>Rate</strong><br>Rs.${provider.hourly_rate}/hour</p>
        <p><strong>Experience</strong><br>${provider.experience}</p>
        <p><strong>Description</strong><br>${provider.description}</p>
        <p><strong>Status</strong><br><span class="status-accepted">${provider.status}</span></p>
    `;
}

// Render Reviews
function renderReviews() {
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = reviews.map(review => `
        <div class="review">
            <p>"${review.text}"</p>
            <p class="reviewer">- ${review.reviewer}</p>
        </div>
    `).join('');
}

// Handle Form Submission and Cost Preview
document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const duration = document.getElementById('duration').value[0];
    const totalCost = provider.hourly_rate * parseInt(duration);

    const data = { date, time, duration, totalCost, service_id: provider.service_id };

    console.log("Sending Booking Data:", data);

    fetch("/book-service", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",  // Ensure proper headers
            "Accept": "application/json"
        },
        body: JSON.stringify(data)  // Ensure payload is properly serialized
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error("Server Error:", data.error);
            alert("Booking Failed: " + data.error);
        } else {
            alert(`Booking Secured!\n\nService: ${provider.service_name}\nProvider: ${provider.name}\nDate: ${date}\nTime: ${time}\nDuration: ${duration} hour${duration > 1 ? 's' : ''}\nTotal Cost: Rs.${totalCost.toLocaleString()}`);
            document.getElementById('bookingForm').reset();
            document.getElementById('costPreview').innerHTML = '';

            // **Add booking to cart**
            addBookingToCart(data.booking_id);  // Pass the newly created booking ID
        }
    })
    .catch(error => {
        console.error("Fetch Error:", error);
        alert("Failed to book your appointment. Please try again!");
    });
});

// **Function to Add Booking to Cart**
function addBookingToCart(bookingId) {
    fetch("/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId })  // Send booking ID
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Cart Error:", data.error);
            alert("Failed to add booking to cart: " + data.error);
        } else {
            alert("Booking added to cart successfully!");
            document.getElementById("cart-count").textContent = data.cart_count; // Update cart count dynamically
        }
    })
    .catch(error => {
        console.error("Cart Fetch Error:", error);
        alert("Error adding booking to cart. Please try again!");
    });
}

// Real-time Cost Preview
document.getElementById('duration').addEventListener('change', (e) => {
    const duration = e.target.value;
    if (duration) {
        const totalCost = provider.hourly_rate * parseInt(duration);
        document.getElementById('costPreview').innerHTML = `Total: Rs.${totalCost.toLocaleString()}`;
    } else {
        document.getElementById('costPreview').innerHTML = '';
    }
});

// Set minimum date to today
document.getElementById('date').setAttribute('min', new Date().toISOString().split('T')[0]);


document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded'); 
    renderServiceDetails();
    renderReviews();
});