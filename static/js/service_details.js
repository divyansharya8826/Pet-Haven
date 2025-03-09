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
        <p><strong>Rate</strong><br>$${provider.hourly_rate}/hour</p>
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
    const duration = document.getElementById('duration').value;
    const totalCost = provider.hourly_rate * parseInt(duration);

    if (date && time && duration) {
        alert(`Booking Secured!\n\nService: ${provider.service_name}\nProvider: ${provider.name}\nDate: ${date}\nTime: ${time}\nDuration: ${duration} hour${duration > 1 ? 's' : ''}\nTotal Cost: $${totalCost.toLocaleString()}`);
        document.getElementById('bookingForm').reset();
        document.getElementById('costPreview').innerHTML = '';
    }
});

// Real-time Cost Preview
document.getElementById('duration').addEventListener('change', (e) => {
    const duration = e.target.value;
    if (duration) {
        const totalCost = provider.hourly_rate * parseInt(duration);
        document.getElementById('costPreview').innerHTML = `Total: $${totalCost.toLocaleString()}`;
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