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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> parent of d019a7c (Minor Changes to CartCheckout , Service details , Service Provider UI (added minimal UI to Popup's))
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
<<<<<<< HEAD

            // **Add booking to cart**
            addBookingToCart(data.booking_id);  // Pass the newly created booking ID
=======
>>>>>>> parent of d019a7c (Minor Changes to CartCheckout , Service details , Service Provider UI (added minimal UI to Popup's))
        }
    })
    .catch(error => {
        console.error("Fetch Error:", error);
        alert("Failed to book your appointment. Please try again!");
<<<<<<< HEAD
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
=======
    ];

    // Render Service Details
    function renderServiceDetails() {
        const serviceDetails = document.getElementById('serviceDetails');
        if (!serviceDetails) return;
        
        serviceDetails.innerHTML = `
            <p><strong>Provider</strong><br>${provider.name}</p>
            <p><strong>Location</strong><br>${provider.address}</p>
            <p><strong>Rate</strong><br>Rs.${provider.hourly_rate}/hour</p>
            <p><strong>Experience</strong><br>${provider.experience}</p>
            <p><strong>Description</strong><br>${provider.description}</p>
            <p><strong>Status</strong><br><span class="status-accepted">${provider.status}</span></p>
        `;
>>>>>>> d019a7c6eed999e464d8d753009306896e3ae900
    }

    // Render Reviews
    function renderReviews() {
        const reviewList = document.getElementById('reviewList');
        if (!reviewList) return;
        
        reviewList.innerHTML = reviews.map(review => `
            <div class="review">
                <p>"${review.text}"</p>
                <p class="reviewer">- ${review.reviewer}</p>
            </div>
        `).join('');
    }

    // Modal Functionality
    const openBookingModalBtn = document.getElementById('openBookingModal');
    const bookingModal = document.getElementById('bookingModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBookingBtn = document.getElementById('cancelBooking');
    const confirmBookingBtn = document.getElementById('confirmBooking');
    const successModal = document.getElementById('successModal');
    const closeSuccessBtn = document.getElementById('closeSuccess');
    const closeSuccessModalBtn = document.getElementById('closeSuccessModal');
    
    // Format date to a more readable format
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Format time to 12-hour format
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }
    
    // Open booking modal and populate summary
    if (openBookingModalBtn) {
        openBookingModalBtn.addEventListener('click', () => {
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const duration = document.getElementById('duration').value;
            
            // Validate form
            if (!date || !time || !duration) {
                alert('Please fill out all booking details');
                return;
            }
            
            const totalCost = provider.hourly_rate * parseInt(duration);
            
            // Populate summary
            document.getElementById('summaryService').textContent = provider.service_name;
            document.getElementById('summaryProvider').textContent = provider.name;
            document.getElementById('summaryDate').textContent = formatDate(date);
            document.getElementById('summaryTime').textContent = formatTime(time);
            document.getElementById('summaryDuration').textContent = `${duration} hour${duration > 1 ? 's' : ''}`;
            document.getElementById('summaryTotal').textContent = `Rs.${totalCost.toLocaleString()}`;
            
            // Show modal
            bookingModal.classList.add('active');
        });
    }
    
    // Close booking modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            bookingModal.classList.remove('active');
        });
    }
    
    // Cancel booking
    if (cancelBookingBtn) {
        cancelBookingBtn.addEventListener('click', () => {
            bookingModal.classList.remove('active');
        });
    }
    
    // Confirm booking
    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', () => {
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const duration = document.getElementById('duration').value;
            const totalCost = provider.hourly_rate * parseInt(duration);
            
            const data = { 
                date, 
                time, 
                duration, 
                totalCost, 
                service_id: provider.service_id 
            };
            
            fetch("/book-service", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    alert("Booking Failed: " + data.error);
                } else {
                    // Close booking modal
                    bookingModal.classList.remove('active');
                    
                    // Show success animation
                    setTimeout(() => {
                        successModal.classList.add('active');
                        const successCheck = document.querySelector('.success-checkmark');
                        if (successCheck) {
                            successCheck.style.display = 'block';
                        }
                        
                        // Reset form
                        document.getElementById('bookingForm').reset();
                        document.getElementById('costPreview').innerHTML = '';
                    }, 300);
                }
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                alert("Failed to book your appointment. Please try again!");
            });
        });
    }
    
    // Close success modal
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }
    
    if (closeSuccessModalBtn) {
        closeSuccessModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }

    // Real-time Cost Preview
    const durationField = document.getElementById('duration');
    if (durationField) {
        durationField.addEventListener('change', (e) => {
            const duration = e.target.value;
            if (duration) {
                const totalCost = provider.hourly_rate * parseInt(duration);
                document.getElementById('costPreview').innerHTML = `Total: Rs.${totalCost.toLocaleString()}`;
            } else {
                document.getElementById('costPreview').innerHTML = '';
            }
        });
    }

    // Set minimum date to today
    const dateField = document.getElementById('date');
    if (dateField) {
        dateField.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM fully loaded'); 
        renderServiceDetails();
        renderReviews();
=======
>>>>>>> parent of d019a7c (Minor Changes to CartCheckout , Service details , Service Provider UI (added minimal UI to Popup's))
    });
});

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