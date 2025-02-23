// document.addEventListener("DOMContentLoaded", function () {
//     fetchDogs();  // Fetch and display dogs when the page loads

//     // Attach filter event listeners
//     document.getElementById("breedFilter").addEventListener("change", applyFilters);
//     document.getElementById("ageFilter").addEventListener("change", applyFilters);
//     document.getElementById("costFilter").addEventListener("input", function () {
//         document.getElementById("costValue").textContent = "Max Cost: Rs." + this.value;
//         applyFilters();
//     });
// });

// // Fetch dogs from the backend
// let allDogs = [];  // Store the full dog list for filtering

// function fetchDogs() {
//     fetch("/api/dogs")  // Fetch dog data from Flask backend
//         .then(response => response.json())
//         .then(dogs => {
//             allDogs = dogs; // Store all dogs for filtering
//             displayDogs(dogs); // Display all dogs initially
//         })
//         .catch(error => console.error("Error fetching dogs:", error));
// }

// // Function to display dogs
// function displayDogs(dogs) {
//     let dogGrid = document.getElementById("dogGrid");
//     dogGrid.innerHTML = ""; // Clear previous listings

//     if (dogs.length === 0) {
//         dogGrid.innerHTML = "<p>No dogs match your filters.</p>";
//         return;
//     }

//     dogs.forEach(dog => {
//         let dogCard = `
//             <div class="dog-card">
//                 <img src="${dog.image}" alt="${dog.name}">
//                 <h3>${dog.name}</h3>
//                 <p>Breed: ${dog.breed}</p>
//                 <p>Age: ${dog.age}</p>
//                 <p>Price: Rs.${dog.price}</p>
//                 <button class="add-to-cart" data-id="${dog.id}">Add to Cart</button>
//             </div>
//         `;
//         dogGrid.innerHTML += dogCard;
//     });

//     attachCartListeners(); // Attach event listeners after adding buttons
// }

// // Function to apply filters
// function applyFilters() {
//     let breedFilter = document.getElementById("breedFilter").value;
//     let ageFilter = document.getElementById("ageFilter").value;
//     let maxCost = document.getElementById("costFilter").value;

//     let filteredDogs = allDogs.filter(dog => {
//         return (
//             (breedFilter === "" || dog.breed === breedFilter) &&
//             (ageFilter === "" || dog.age === ageFilter) &&
//             (dog.price <= maxCost)
//         );
//     });

//     displayDogs(filteredDogs);
// }

// // Attach event listeners to cart buttons
// function attachCartListeners() {
//     document.querySelectorAll(".add-to-cart").forEach(button => {
//         button.addEventListener("click", function () {
//             let dogId = this.getAttribute("data-id");

//             fetch("/cart/add", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ dog_id: dogId })
//             })
//             .then(response => response.json())
//             .then(data => {
//                 alert(data.message);
//                 document.getElementById("cart-count").textContent = data.cart_count; // Update cart count
//             })
//             .catch(error => console.error("Error adding to cart:", error));
//         });
//     });
// }

// document.addEventListener("DOMContentLoaded", function () {
//     fetchDogs();
//     updateCartCount();  // Fetch and update cart count on page load
// });

// // Function to fetch cart count from backend
// function updateCartCount() {
//     fetch("/api/cart_count")
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById("cart-count").textContent = data.cart_count;  //Update UI
//         })
//         .catch(error => console.error("Error fetching cart count:", error));
// }
// function attachCartListeners() {
//     document.querySelectorAll(".add-to-cart").forEach(button => {
//         button.addEventListener("click", function () {
//             let dogId = this.getAttribute("data-id");

//             fetch("/cart/add", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ dog_id: dogId })
//             })
//             .then(response => response.json())
//             .then(data => {
//                 alert(data.message);
//                 updateCartCount();  // Call the function to update cart count
//             })
//             .catch(error => console.error("Error adding to cart:", error));
//         });
//     });
// }

// function attachRemoveListeners() {
//     document.querySelectorAll(".remove-from-cart").forEach(button => {
//         button.addEventListener("click", function () {
//             let dogId = this.getAttribute("data-id");

//             fetch("/cart/remove", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ dog_id: dogId })
//             })
//             .then(response => response.json())
//             .then(data => {
//                 alert(data.message);
//                 updateCartCount();  // Update cart count
//                 removeDogFromUI(dogId);  // Remove dog from UI without reloading
//             })
//             .catch(error => console.error("Error removing from cart:", error));
//         });
//     });
// }

// // Function to Remove Item from UI Without Reloading
// function removeDogFromUI(dogId) {
//     let cartItem = document.querySelector(`.cart-item[data-id='${dogId}']`);
//     if (cartItem) {
//         cartItem.remove();
//     }

//     // If cart is empty after removal, show "empty cart" message
//     if (document.querySelectorAll(".cart-item").length === 0) {
//         document.getElementById("cart-list").innerHTML = "<p>Your cart is empty.</p>";
//     }
// }

// script.js (same as before, no changes needed)

// document.addEventListener("DOMContentLoaded", function () {
//   fetchDogs();

//   // Filter event listeners
//   document
//     .getElementById("breedFilter")
//     .addEventListener("change", applyFilters);
//   document.getElementById("ageFilter").addEventListener("change", applyFilters);
//   document.getElementById("minPrice").addEventListener("input", applyFilters); // Min price
//   document.getElementById("maxPrice").addEventListener("input", applyFilters); // Max price
//   document
//     .getElementById("searchInput")
//     .addEventListener("keyup", applyFilters);
// });

// let allDogs = [];

// function fetchDogs() {
//   fetch("/api/dogs")
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then((dogs) => {
//       allDogs = dogs;
//       // Initialize max price filter to the highest dog price.  Good UX.
//       const maxDogPrice = dogs.reduce(
//         (max, dog) => Math.max(max, dog.price),
//         0
//       );
//       document.getElementById("maxPrice").value = maxDogPrice;
//       document.getElementById(
//         "maxPriceValue"
//       ).textContent = `Max Price: Rs.${maxDogPrice}`; // Initial display
//       displayDogs(dogs);
//     })
//     .catch((error) => console.error("Error fetching dogs:", error));
// }

// function displayDogs(dogs) {
//   const dogGrid = document.getElementById("dogGrid");
//   dogGrid.innerHTML = "";

//   if (dogs.length === 0) {
//     dogGrid.innerHTML = "<p>No dogs match your filters.</p>";
//     return;
//   }

//   dogs.forEach((dog) => {
//     const dogCard = document.createElement("div");
//     dogCard.classList.add("dog-card");

//     dogCard.innerHTML = `
//               <img src="${dog.image}" alt="${dog.name}" style="width: 100%; height: 200px; object-fit: cover;">
//               <h3>${dog.name}</h3>
//               <p>Breed: ${dog.breed}</p>
//               <p>Age: ${dog.age}</p>
//               <p>Price: Rs.${dog.price}</p>
//               <div class="dog-card-button-container">
//                   <button class="add-to-cart" data-id="${dog.id}">Add to Cart</button>
//               </div>
//       `;
//     dogGrid.appendChild(dogCard);
//   });

//   attachCartListeners();
// }

// function applyFilters() {
//   const breedFilter = document.getElementById("breedFilter").value;
//   const ageFilter = document.getElementById("ageFilter").value;
//   const minPrice = parseInt(document.getElementById("minPrice").value) || 0; // Default to 0 if empty
//   const maxPrice =
//     parseInt(document.getElementById("maxPrice").value) || Infinity; // Default to Infinity if empty
//   const searchTerm = document.getElementById("searchInput").value.toLowerCase();

//   //Update the displayed min/max price
//   document.getElementById(
//     "minPriceValue"
//   ).textContent = `Min Price: Rs.${minPrice}`;
//   document.getElementById(
//     "maxPriceValue"
//   ).textContent = `Max Price: Rs.${maxPrice}`;

//   const filteredDogs = allDogs.filter((dog) => {
//     const nameMatch = dog.name.toLowerCase().includes(searchTerm);
//     const breedMatch = dog.breed.toLowerCase().includes(searchTerm);
//     const descriptionMatch = dog.description
//       ? dog.description.toLowerCase().includes(searchTerm)
//       : false;
//     return (
//       (breedFilter === "" || dog.breed === breedFilter) &&
//       (ageFilter === "" || dog.age === ageFilter) &&
//       dog.price >= minPrice && // Min price check
//       dog.price <= maxPrice && // Max price check
//       (nameMatch || breedMatch || descriptionMatch)
//     );
//   });

//   displayDogs(filteredDogs);
// }

// function attachCartListeners() {
//   document.querySelectorAll(".add-to-cart").forEach((button) => {
//     button.addEventListener("click", function () {
//       const dogId = this.getAttribute("data-id");
//       fetch("/cart/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ dog_id: dogId }),
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Network response was not ok");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           alert(data.message); // Consider a better notification
//           updateCartCount();
//         })
//         .catch((error) => console.error("Error adding to cart:", error));
//     });
//   });
// }

// function updateCartCount() {
//   fetch("/api/cart_count")
//     .then((response) => response.json())
//     .then((data) => {
//       document.getElementById("cart-count").textContent = data.cart_count;
//     })
//     .catch((error) => console.error("Error fetching cart count:", error));
// }

// function attachRemoveListeners() {
//   document.querySelectorAll(".remove-from-cart").forEach((button) => {
//     button.addEventListener("click", function () {
//       const dogId = this.getAttribute("data-id");
//       fetch("/cart/remove", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ dog_id: dogId }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           alert(data.message); // Consider a better notification
//           updateCartCount();
//           removeDogFromUI(dogId);
//         })
//         .catch((error) => console.error("Error removing from cart:", error));
//     });
//   });
// }

// function removeDogFromUI(dogId) {
//   const cartItem = document.querySelector(`.cart-item[data-id="${dogId}"]`);
//   if (cartItem) {
//     cartItem.remove();
//   }
//   if (document.querySelectorAll(".cart-item").length === 0) {
//     document.getElementById("cart-list").innerHTML =
//       "<p>Your cart is empty.</p>";
//   }
// }

// document.addEventListener("DOMContentLoaded", function () {
//   fetchDogs();
//   updateCartCount();
// });

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

// Rest of your existing functions (attachCartListeners, updateCartCount, etc.) remain the same


// Attach event listeners to cart buttons
// function attachCartListeners() {
//     document.querySelectorAll(".add-to-cart").forEach(button => {
//         button.addEventListener("click", function () {
//             let dogId = this.getAttribute("data-id");

//             fetch("/cart/add", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ dog_id: dogId })
//             })
//             .then(response => response.json())
//             .then(data => {
//                 alert(data.message);
//                 document.getElementById("cart-count").textContent = data.cart_count; // Update cart count
//             })
//             .catch(error => console.error("Error adding to cart:", error));
//         });
//     });
// }

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