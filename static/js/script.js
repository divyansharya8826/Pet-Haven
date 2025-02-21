document.addEventListener("DOMContentLoaded", function () {
    let dogs = [];
    const dogGrid = document.getElementById("dogGrid");
    const breedFilter = document.getElementById("breedFilter");
    const ageFilter = document.getElementById("ageFilter");
    const costFilter = document.getElementById("costFilter");
    const costValue = document.getElementById("costValue");
  
    // Fetch dogs initially
    fetchDogs();
  
    // Event Listeners
    costFilter.addEventListener("input", updateCostValue);
    breedFilter.addEventListener("change", filterDogs);
    ageFilter.addEventListener("change", filterDogs);
    costFilter.addEventListener("input", filterDogs);
  
    // Function to fetch dogs from API
    function fetchDogs() {
      fetch("/api/dogs")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          dogs = data;
  
          // Set max price filter value dynamically
          const maxPrice = dogs.reduce((max, dog) => Math.max(max, dog.price), 0);
          costFilter.max = maxPrice;
          costFilter.value = maxPrice;
          updateCostValue();
  
          displayDogs(dogs); // Initial display
        })
        .catch((error) => console.error("Error fetching dogs:", error));
    }
  
    // Function to update the displayed max cost value dynamically
    function updateCostValue() {
      costValue.innerText = `Max Cost: ₹${costFilter.value}`;
    }
  
    // Function to filter dogs based on criteria
    function filterDogs() {
      const breed = breedFilter.value;
      const age = ageFilter.value;
      const maxCost = parseInt(costFilter.value);
  
      // Filter dogs by breed, age, and cost independently
      const filteredDogs = dogs.filter((dog) => {
        return (
          (breed === "" || dog.breed === breed) &&
          (age === "" || dog.age === age) &&
          dog.price <= maxCost
        );
      });
  
      displayDogs(filteredDogs); // Update the display with the filtered dogs
    }
  
    // Function to dynamically display dogs on the page
    function displayDogs(dogList) {
      dogGrid.innerHTML = ""; // Clear previous results
  
      if (dogList.length === 0) {
        dogGrid.innerHTML = "<p>No dogs match the selected criteria.</p>";
        return;
      }
  
      dogList.forEach((dog) => {
        const dogCard = document.createElement("div");
        dogCard.classList.add("dog-card");
  
        // Use default image if `dog.image` is empty
        const dogImage = dog.image && dog.image.trim() !== "" ? dog.image : "static/images/default-dog.jpg";
  
        dogCard.innerHTML = `
          <img src="${dogImage}" alt="${dog.name}">
          <h3>${dog.name}</h3>
          <p>Breed: ${dog.breed}</p>
          <p>Age: ${dog.age}</p>
          <p>Cost: ₹${dog.price}</p>
          <button class="add-to-cart" data-id="${dog.id}">Add to Cart</button>
        `;
  
        dogGrid.appendChild(dogCard);
      });
  
      attachCartListeners(); // Attach event listeners for "Add to Cart"
    }
  
    // Attach event listeners to "Add to Cart" buttons
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
  
            // Update cart count only if element exists
            let cartCount = document.getElementById("cart-count");
            if (cartCount) {
              cartCount.textContent = data.cart_count;
            }
          })
          .catch(error => console.error("Error adding to cart:", error));
        });
      });
    }
  
    // Attach event listeners to "Remove from Cart" buttons
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
            location.reload(); // Refresh cart page
          })
          .catch(error => console.error("Error removing from cart:", error));
        });
      });
    }
  });