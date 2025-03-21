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

// Function to handle booking from service provider page
function bookService(serviceId) {
    window.location.href = `/service-details/${serviceId}`;
}

const providerDataElement = document.getElementById('provider-data');
// Only try to parse provider data if the element exists (for service details page)
if (providerDataElement) {
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
        if (!serviceDetails) return;
        
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
    });
}