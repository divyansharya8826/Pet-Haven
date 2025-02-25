/****************************************** fetching dogs details from the api for listing and checking the filters for apply changes in the listing */
document.addEventListener("DOMContentLoaded", function () {
  fetchDogs();
  // Filter event listeners
  document
    .getElementById("breedFilter")
    .addEventListener("change", applyFilters);
  document.getElementById("ageFilter").addEventListener("change", applyFilters);
  document.getElementById("minPrice").addEventListener("input", applyFilters);
  document.getElementById("maxPrice").addEventListener("input", applyFilters);
  document
    .getElementById("searchInput")
    .addEventListener("keyup", applyFilters);
});

let allDogs = [];
const DOGS_PER_PAGE = 12;
let currentPage = 1;

function fetchDogs() {
  fetch("/api/dogs")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((dogs) => {
      allDogs = dogs;
      const maxDogPrice = dogs.reduce(
        (max, dog) => Math.max(max, dog.price),
        0
      );
      document.getElementById("maxPrice").value = maxDogPrice;
      document.getElementById(
        "maxPriceValue"
      ).textContent = `Max Price: Rs.${maxDogPrice}`;
      applyFilters(); // Initial display with filters
    })
    .catch((error) => console.error("Error fetching dogs:", error));
}

/********************************* function for displaying dogs in a list ***********************************/
function displayDogs(dogs) {
  const dogGrid = document.getElementById("dogGrid");
  dogGrid.innerHTML = "";

  if (dogs.length === 0) {
    dogGrid.innerHTML = "<p>No dogs match your filters.</p>";
    updatePagination(0);
    return;
  }

  // Calculate pagination
  const totalPages = Math.ceil(dogs.length / DOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * DOGS_PER_PAGE;
  const endIndex = startIndex + DOGS_PER_PAGE;
  const paginatedDogs = dogs.slice(startIndex, endIndex);

  paginatedDogs.forEach((dog) => {
    const dogCard = document.createElement("div");
    dogCard.classList.add("dog-card");

    dogCard.innerHTML = `
      <a href="/dogs/${dog.id}" style="text-decoration:none;">
        <img src="${dog.image}" alt="${dog.name}" style="width: 100%; height: 200px; object-fit: cover;">
        <h3>${dog.name}</h3>
        <p>Breed: ${dog.breed}</p>
        <p>Age: ${dog.age}</p>
        <p>Price: Rs.${dog.price}</p>
      </a>
      <div class="dog-card-button-container">
        <button class="add-to-cart" data-id="${dog.id}">Add to Cart</button>
      </div>
    `;
    dogGrid.appendChild(dogCard);
  });

  updatePagination(totalPages, dogs.length);
  attachCartListeners();
}

/**************************************** function for updating pagination ***********************************/
function updatePagination(totalPages, totalItems) {
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination";

  // Previous Button
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      applyFilters();
    }
  });
  paginationContainer.appendChild(prevButton);

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.toggle("active", i === currentPage);
    pageButton.addEventListener("click", () => {
      currentPage = i;
      applyFilters();
    });
    paginationContainer.appendChild(pageButton);
  }

  // Next Button
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      applyFilters();
    }
  });
  paginationContainer.appendChild(nextButton);

  // Page Info
  const pageInfo = document.createElement("span");
  const start = (currentPage - 1) * DOGS_PER_PAGE + 1;
  const end = Math.min(currentPage * DOGS_PER_PAGE, totalItems);
  pageInfo.textContent = ` Showing ${start}-${end} of ${totalItems} dogs`;
  paginationContainer.appendChild(pageInfo);

  const existingPagination = document.querySelector(".pagination");
  if (existingPagination) {
    existingPagination.remove();
  }
  document.querySelector(".dog-listing").appendChild(paginationContainer);
}

/************************************ function for appling filters ******************************************/
function applyFilters() {
  const breedFilter = document.getElementById("breedFilter").value;
  const ageFilter = document.getElementById("ageFilter").value;
  const minPrice = parseInt(document.getElementById("minPrice").value) || 0;
  const maxPrice =
    parseInt(document.getElementById("maxPrice").value) || Infinity;
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  document.getElementById(
    "minPriceValue"
  ).textContent = `Min Price: Rs.${minPrice}`;
  document.getElementById(
    "maxPriceValue"
  ).textContent = `Max Price: Rs.${maxPrice}`;

  const filteredDogs = allDogs.filter((dog) => {
    const nameMatch = dog.name.toLowerCase().includes(searchTerm);
    const breedMatch = dog.breed.toLowerCase().includes(searchTerm);
    const descriptionMatch = dog.description
      ? dog.description.toLowerCase().includes(searchTerm)
      : false;
    return (
      (breedFilter === "" || dog.breed === breedFilter) &&
      (ageFilter === "" || dog.age === ageFilter) &&
      dog.price >= minPrice &&
      dog.price <= maxPrice &&
      (nameMatch || breedMatch || descriptionMatch)
    );
  });

  displayDogs(filteredDogs);
}

/********************************** function for updating cart count on page load ****************************/
document.addEventListener("DOMContentLoaded", function () {
    fetchDogs();
    updateCartCount();  // Fetch and update cart count on page load
});

/***************************************** function to fetch cart count from backend *************************/
function updateCartCount() {
    fetch("/api/cart_count")
        .then(response => response.json())
        .then(data => {
            document.getElementById("cart-count").textContent = data.cart_count;  //Update UI
        })
        .catch(error => console.error("Error fetching cart count:", error));
}

/*************************************** function for add to cart feature ************************************/
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
/************************************** function for remove from cart feature ********************************/
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

/*********************************** function to remove item from UI without reloading **********************/
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