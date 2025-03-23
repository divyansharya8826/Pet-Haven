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
      <img src="${dog.image}" alt="${dog.name}" style="width: 100%; height: 200px; object-fit: cover;">
      <h3>${dog.name}</h3>
      <p>Breed: ${dog.breed}</p>
      <p>Age: ${dog.age}</p>
      <p>Price: Rs.${dog.price}</p>      
      <div class="dog-card-button-container">
        <button class="add-to-cart" data-id="${dog.id}">Add to Cart</button>
      </div>
    `;
    const dogCardImage = dogCard.querySelector("img");
    dogCardImage.addEventListener("click", function(){
      displayDogDetails(dog);
    })
    dogGrid.appendChild(dogCard);
  });

  updatePagination(totalPages, dogs.length);
  attachCartListeners();
}

function displayDogDetails(dog) {
  let detailsSection = document.getElementById("dogDetails");
  detailsSection.innerHTML = `
    <div class="dog-info">
      <img src="${dog.image}" alt="${dog.name}" />
      <h2>${dog.name}</h2>
      <p><strong>Breed:</strong> ${dog.breed}</p>
      <p><strong>Age:</strong> ${dog.age}</p>
      <p><strong>Price:</strong> Rs.${dog.price}</p>
      <p><strong>Vaccinated:</strong> ${dog.vaccinated}</p>
      <p><strong>Description:</strong> ${dog.description}</p>
      <button class="add-to-cart modal-add-btn" data-id="${dog.id}">
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
    </div>
  `;
  
  let modal = document.getElementById("dogDetailsModal");
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
  modal.style.display = "flex"; // Use flex to center the modal
  
  // Attach event listener to the Add to Cart button in the modal
  const addBtn = modal.querySelector('.modal-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      let dogId = this.getAttribute("data-id");
      
      fetch("/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dog_id: dogId })
      })
      .then(response => response.json())
      .then(data => {
          closeModal();
          showAddToCartPopup(dog.name, dog.image, dog.breed, dog.price, data.message);
          updateCartCount();
      })
      .catch(error => console.error("Error adding to cart:", error));
    });
  }
}

function closeModal() {
  let modal = document.getElementById("dogDetailsModal");
  modal.style.display = "none";
  document.body.style.overflow = ''; // Restore scrolling
}

// Attach close event to the "X" button
document.getElementById("closeModal").addEventListener("click", closeModal);

// Close the modal if the user clicks anywhere outside of the modal content
window.addEventListener("click", function(event) {
  let modal = document.getElementById("dogDetailsModal");
  if (event.target === modal) {
    closeModal();
  }
});

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
            
            // Find the dog data to display in popup
            const dogCard = this.closest('.dog-card');
            const dogName = dogCard.querySelector('h3').textContent;
            const dogImage = dogCard.querySelector('img').src;
            const dogBreed = dogCard.querySelector('p:nth-of-type(1)').textContent.replace('Breed: ', '');
            const dogPrice = dogCard.querySelector('p:nth-of-type(3)').textContent.replace('Price: Rs.', '');

            fetch("/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dog_id: dogId })
            })
            .then(response => response.json())
            .then(data => {
                // Show custom popup instead of alert
                showAddToCartPopup(dogName, dogImage, dogBreed, dogPrice, data.message);
                updateCartCount();  // Call the function to update cart count
            })
            .catch(error => console.error("Error adding to cart:", error));
        });
    });
}

// Function to show Add to Cart popup
function showAddToCartPopup(dogName, dogImage, dogBreed, dogPrice, message) {
    // Create popup elements if they don't exist
    if (!document.getElementById('addToCartPopup')) {
        const popupHTML = `
            <div id="addToCartPopup" class="cart-popup">
                <div class="cart-popup-content">
                    <span class="cart-popup-close">&times;</span>
                    <div class="cart-popup-header">
                        <i class="fas fa-check-circle"></i>
                        <h3>Added to Cart!</h3>
                    </div>
                    <div class="cart-popup-body">
                        <div class="cart-popup-item">
                            <img id="popupDogImage" src="" alt="Dog Image">
                            <div class="cart-popup-item-details">
                                <h4 id="popupDogName"></h4>
                                <p id="popupDogBreed"></p>
                                <p id="popupDogPrice"></p>
                            </div>
                        </div>
                        <p id="popupMessage" class="cart-popup-message"></p>
                    </div>
                    <div class="cart-popup-footer">
                        <button id="continueShopping" class="continue-shopping">Continue Shopping</button>
                        <button id="viewCart" class="view-cart">View Cart</button>
                    </div>
                </div>
            </div>
        `;
        
        const popupContainer = document.createElement('div');
        popupContainer.innerHTML = popupHTML;
        document.body.appendChild(popupContainer.firstElementChild);
        
        // Add event listeners
        document.querySelector('.cart-popup-close').addEventListener('click', closeCartPopup);
        document.getElementById('continueShopping').addEventListener('click', closeCartPopup);
        document.getElementById('viewCart').addEventListener('click', () => {
            window.location.href = '/cart';
        });
    }
    
    // Update popup with dog details
    document.getElementById('popupDogImage').src = dogImage;
    document.getElementById('popupDogName').textContent = dogName;
    document.getElementById('popupDogBreed').textContent = dogBreed;
    document.getElementById('popupDogPrice').textContent = `Rs.${dogPrice}`;
    document.getElementById('popupMessage').textContent = message;
    
    // Show popup
    const popup = document.getElementById('addToCartPopup');
    popup.style.display = 'flex';
    
    // Auto close after 5 seconds
    setTimeout(closeCartPopup, 5000);
}

function closeCartPopup() {
    const popup = document.getElementById('addToCartPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

/************************************** function for remove from cart feature ********************************/
function attachRemoveListeners() {
    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", function () {
            let dogId = this.getAttribute("data-id");
            let dogName = this.getAttribute("data-name");
            let dogImage = this.getAttribute("data-image");
            
            // Show confirmation popup instead of immediately removing
            showRemoveConfirmation(dogId, dogName, dogImage);
        });
    });
    
    // Add event listeners to the confirmation modal
    const confirmModal = document.getElementById('removeConfirmModal');
    if (confirmModal) {
        document.querySelector('#cancelRemove').addEventListener('click', closeRemoveConfirmation);
        document.querySelector('.cart-popup-close').addEventListener('click', closeRemoveConfirmation);
        
        // Handle the confirmation button
        document.querySelector('#confirmRemove').addEventListener('click', function() {
            const dogId = this.getAttribute('data-dog-id');
            removeDogFromCart(dogId);
        });
    }
}

// Function to show removal confirmation popup
function showRemoveConfirmation(dogId, dogName, dogImage) {
    const modal = document.getElementById('removeConfirmModal');
    if (!modal) return;
    
    // Update the modal content
    document.getElementById('removeItemName').textContent = dogName;
    document.getElementById('removeItemImage').src = dogImage;
    
    // Store the dog ID on the confirm button
    document.getElementById('confirmRemove').setAttribute('data-dog-id', dogId);
    
    // Show the modal
    modal.style.display = 'flex';
}

// Function to close the removal confirmation
function closeRemoveConfirmation() {
    const modal = document.getElementById('removeConfirmModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Function to actually remove the dog from cart
function removeDogFromCart(dogId) {
    fetch("/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dog_id: dogId })
    })
    .then(response => response.json())
    .then(data => {
        // Close the confirmation popup
        closeRemoveConfirmation();
        
        // Show success message with a popup instead of alert
        showRemoveSuccessPopup(data.message);
        
        // Update cart count
        updateCartCount();
        
        // Remove dog from UI without reloading
        removeDogFromUI(dogId);
    })
    .catch(error => {
        console.error("Error removing from cart:", error);
        // Show error message
        showRemoveErrorPopup("Failed to remove dog from cart. Try again!");
    });
}

// Function to show success message after removing
function showRemoveSuccessPopup(message) {
    // Create popup if it doesn't exist
    if (!document.getElementById('removeSuccessPopup')) {
        const popupHTML = `
            <div id="removeSuccessPopup" class="cart-popup">
                <div class="cart-popup-content">
                    <span class="cart-popup-close">&times;</span>
                    <div class="cart-popup-header">
                        <i class="fas fa-check-circle"></i>
                        <h3>Item Removed</h3>
                    </div>
                    <div class="cart-popup-body">
                        <p id="removeSuccessMessage" class="cart-popup-message"></p>
                    </div>
                    <div class="cart-popup-footer">
                        <button id="continueShoppingAfterRemove" class="continue-shopping">Continue Shopping</button>
                    </div>
                </div>
            </div>
        `;
        
        const popupContainer = document.createElement('div');
        popupContainer.innerHTML = popupHTML;
        document.body.appendChild(popupContainer.firstElementChild);
        
        // Add event listeners
        document.querySelector('#removeSuccessPopup .cart-popup-close').addEventListener('click', 
            () => document.getElementById('removeSuccessPopup').style.display = 'none');
        document.getElementById('continueShoppingAfterRemove').addEventListener('click', 
            () => document.getElementById('removeSuccessPopup').style.display = 'none');
    }
    
    // Update message and show popup
    document.getElementById('removeSuccessMessage').textContent = message;
    document.getElementById('removeSuccessPopup').style.display = 'flex';
    
    // Auto close after 3 seconds
    setTimeout(() => {
        const popup = document.getElementById('removeSuccessPopup');
        if (popup) popup.style.display = 'none';
    }, 3000);
}

// Function to show error message
function showRemoveErrorPopup(message) {
    // Create popup if it doesn't exist
    if (!document.getElementById('removeErrorPopup')) {
        const popupHTML = `
            <div id="removeErrorPopup" class="cart-popup">
                <div class="cart-popup-content">
                    <span class="cart-popup-close">&times;</span>
                    <div class="cart-popup-header">
                        <i class="fas fa-exclamation-circle" style="color: #dc3545;"></i>
                        <h3>Error</h3>
                    </div>
                    <div class="cart-popup-body">
                        <p id="removeErrorMessage" class="cart-popup-message" style="color: #dc3545;"></p>
                    </div>
                    <div class="cart-popup-footer">
                        <button id="tryAgain" class="continue-shopping">Try Again</button>
                    </div>
                </div>
            </div>
        `;
        
        const popupContainer = document.createElement('div');
        popupContainer.innerHTML = popupHTML;
        document.body.appendChild(popupContainer.firstElementChild);
        
        // Add event listeners
        document.querySelector('#removeErrorPopup .cart-popup-close').addEventListener('click', 
            () => document.getElementById('removeErrorPopup').style.display = 'none');
        document.getElementById('tryAgain').addEventListener('click', 
            () => document.getElementById('removeErrorPopup').style.display = 'none');
    }
    
    // Update message and show popup
    document.getElementById('removeErrorMessage').textContent = message;
    document.getElementById('removeErrorPopup').style.display = 'flex';
}

/*********************************** function to remove item from UI without reloading **********************/
function removeDogFromUI(dogId) {
    let cartItem = document.querySelector(`.cart-item[data-id='${dogId}']`);
    if (cartItem) {
        cartItem.remove();
    }

    // Update cart count in the header
    const cartCountElements = document.querySelectorAll("#cart-count");
    cartCountElements.forEach(element => {
        const currentCount = parseInt(element.textContent || "0");
        if (currentCount > 0) {
            element.textContent = currentCount - 1;
        } else {
            element.textContent = "0";
        }
    });

    // If cart is empty after removal, show "empty cart" message
    if (document.querySelectorAll(".cart-item").length === 0) {
        const cartList = document.getElementById("cart-list");
        if (cartList) {
            cartList.className = "empty-cart";
            cartList.innerHTML = `
                <div class="empty-cart-content">
                    <i class="fas fa-shopping-cart fa-4x"></i>
                    <p>Your cart is empty.</p>
                    <a href="/" class="browse-btn">
                        <i class="fas fa-paw"></i> Browse Dogs
                    </a>
                </div>
            `;
        }
        
        // Hide the cart summary section
        const cartSummary = document.querySelector(".cart-summary");
        if (cartSummary) {
            cartSummary.style.display = "none";
        }
    } else {
        // Update total price
        updateCartTotal();
    }
}

// Function to update cart total price
function updateCartTotal() {
    const cartItems = document.querySelectorAll(".cart-item");
    let total = 0;
    
    cartItems.forEach(item => {
        const priceText = item.querySelector(".item-details p:nth-of-type(3)").textContent;
        const price = parseInt(priceText.replace(/[^0-9]/g, ""));
        total += price;
    });
    
    const totalPriceElement = document.getElementById("total-price");
    if (totalPriceElement) {
        totalPriceElement.textContent = total;
    }
}