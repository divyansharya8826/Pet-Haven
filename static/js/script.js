document.addEventListener("DOMContentLoaded", function () {
<<<<<<< HEAD
  let dogs = [];
  const dogGrid = document.getElementById("dogGrid");
  const breedFilter = document.getElementById("breedFilter");
  const ageFilter = document.getElementById("ageFilter");
  const costFilter = document.getElementById("costFilter");
  const costValue = document.getElementById("costValue");

  fetchDogs();

  costFilter.addEventListener("input", updateCostValue);

  breedFilter.addEventListener("change", filterDogs);
  ageFilter.addEventListener("change", filterDogs);
  costFilter.addEventListener("input", filterDogs);

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
        const maxPrice = dogs.reduce((max, dog) => Math.max(max, dog.price), 0);

        costFilter.max = maxPrice;
        costFilter.value = maxPrice;
        updateCostValue();
        displayDogs(dogs); // Initial display
      })
      .catch((error) => console.error("Error fetching dogs:", error));
  }

  function updateCostValue() {
    costValue.innerText = `Max Cost: ₹${costFilter.value}`;
  }

  function filterDogs() {
    const breed = breedFilter.value;
    const age = ageFilter.value;
    const maxCost = parseInt(costFilter.value);

    const filteredDogs = dogs.filter((dog) => {
      return (
        (breed === "" || dog.breed === breed) &&
        (age === "" || dog.age === age) &&
        dog.price <= maxCost
      );
    });

    displayDogs(filteredDogs);
  }

  function displayDogs(dogList) {
    dogGrid.innerHTML = ""; // Clear previous results
    if (dogList.length === 0) {
      dogGrid.innerHTML = "<p>No dogs match the selected criteria.</p>";
      return;
    }

    dogList.forEach((dog) => {
      const dogCard = document.createElement("div");
      dogCard.classList.add("dog-card");
      dogCard.innerHTML = `
                <img src="${dog.image}" alt="${dog.name}">
                <h3>${dog.name}</h3>
                <p>Breed: ${dog.breed}</p>
                <p>Age: ${dog.age}</p>
                <p>Cost: ₹${dog.price}</p>
            `;
      dogGrid.appendChild(dogCard);
=======
    fetchDogs();
});

function fetchDogs() {
    fetch("/api/dogs") // Fetch dog data from Flask backend
        .then(response => response.json())
        .then(dogs => {
            let dogGrid = document.getElementById("dogGrid");
            dogGrid.innerHTML = ""; // Clear previous listings

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
        })
        .catch(error => console.error("Error fetching dogs:", error));
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
                document.getElementById("cart-count").textContent = data.cart_count; // Update cart count
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
                location.reload(); // Refresh cart page
            })
            .catch(error => console.error("Error removing from cart:", error));
        });
>>>>>>> 1c886ca (cart)
    });
  }
});
