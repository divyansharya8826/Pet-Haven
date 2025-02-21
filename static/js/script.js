document.addEventListener("DOMContentLoaded", function () {
    fetchDogs();  // Fetch and display dogs when the page loads

    // Attach filter event listeners
    document.getElementById("breedFilter").addEventListener("change", applyFilters);
    document.getElementById("ageFilter").addEventListener("change", applyFilters);
    document.getElementById("costFilter").addEventListener("input", function () {
        document.getElementById("costValue").textContent = "Max Cost: Rs." + this.value;
        applyFilters();
    });
});

// Fetch dogs from the backend
let allDogs = [];  // Store the full dog list for filtering

function fetchDogs() {
    fetch("/api/dogs")  // Fetch dog data from Flask backend
        .then(response => response.json())
        .then(dogs => {
            allDogs = dogs; // Store all dogs for filtering
            displayDogs(dogs); // Display all dogs initially
        })
        .catch(error => console.error("Error fetching dogs:", error));
}

// Function to display dogs
function displayDogs(dogs) {
    let dogGrid = document.getElementById("dogGrid");
    dogGrid.innerHTML = ""; // Clear previous listings

    if (dogs.length === 0) {
        dogGrid.innerHTML = "<p>No dogs match your filters.</p>";
        return;
    }

    dogs.forEach(dog => {
        let dogCard = `
            <div class="dog-card">
                <img src="${dog.image}" alt="${dog.name}">
                <h3>${dog.name}</h3>
                <p>Breed: ${dog.breed}</p>
                <p>Age: ${dog.age}</p>
                <p>Price: Rs.${dog.price}</p>
                <button class="add-to-cart" data-id="${dog.id}">Add to Cart</button>
            </div>
        `;
        dogGrid.innerHTML += dogCard;
    });

    attachCartListeners(); // Attach event listeners after adding buttons
}

// Function to apply filters
function applyFilters() {
    let breedFilter = document.getElementById("breedFilter").value;
    let ageFilter = document.getElementById("ageFilter").value;
    let maxCost = document.getElementById("costFilter").value;

    let filteredDogs = allDogs.filter(dog => {
        return (
            (breedFilter === "" || dog.breed === breedFilter) &&
            (ageFilter === "" || dog.age === ageFilter) &&
            (dog.price <= maxCost)
        );
    });

    displayDogs(filteredDogs);
}

// Attach event listeners to cart buttons
function attachCartListeners() {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            let dogId = this.getAttribute("data-id");

            fetch("/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dog_id: dogId })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                document.getElementById("cart-count").textContent = data.cart_count; // Update cart count
            })
            .catch(error => console.error("Error adding to cart:", error));
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    fetchDogs();
    updateCartCount();  // Fetch and update cart count on page load
});

// Function to fetch cart count from backend
function updateCartCount() {
    fetch("/api/cart_count")
        .then(response => response.json())
        .then(data => {
            document.getElementById("cart-count").textContent = data.cart_count;  //Update UI
        })
        .catch(error => console.error("Error fetching cart count:", error));
}
function attachCartListeners() {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            let dogId = this.getAttribute("data-id");

            fetch("/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dog_id: dogId })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                updateCartCount();  // Call the function to update cart count
            })
            .catch(error => console.error("Error adding to cart:", error));
        });
    });
}

function attachRemoveListeners() {
    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", function () {
            let dogId = this.getAttribute("data-id");

            fetch("/cart/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dog_id: dogId })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                updateCartCount();  // Update cart count
                removeDogFromUI(dogId);  // Remove dog from UI without reloading
            })
            .catch(error => console.error("Error removing from cart:", error));
        });
    });
}

// Function to Remove Item from UI Without Reloading
function removeDogFromUI(dogId) {
    let cartItem = document.querySelector(`.cart-item[data-id='${dogId}']`);
    if (cartItem) {
        cartItem.remove();
    }

    // If cart is empty after removal, show "empty cart" message
    if (document.querySelectorAll(".cart-item").length === 0) {
        document.getElementById("cart-list").innerHTML = "<p>Your cart is empty.</p>";
    }
}
