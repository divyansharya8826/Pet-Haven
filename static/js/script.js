document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/dogs")  // Fetch dog data from Flask API
        .then(response => response.json())
        .then(data => {
            dogs = data
            displayDogs(dogs); // Initialize with all dogs displayed
        })
        .catch(error => console.error("Error fetching dogs:", error));
});

const dogGrid = document.getElementById("dogGrid");
const breedFilter = document.getElementById("breedFilter");
const ageFilter = document.getElementById("ageFilter");
const costFilter = document.getElementById("costFilter");
const costValue = document.getElementById("costValue");

// Update cost label when range slider is moved
costFilter.addEventListener("input", updateCostValue);

// Trigger filtering when any filter is applied
breedFilter.addEventListener("change", filterDogs);
ageFilter.addEventListener("change", filterDogs);
costFilter.addEventListener("input", filterDogs);

// Update the displayed max cost value dynamically
function updateCostValue() {
    costValue.innerText = `Max Cost: ₹${costFilter.value}`;
}

// Function to filter dogs based on selected criteria
function filterDogs() {
    const breed = breedFilter.value;
    const age = ageFilter.value;
    const maxCost = parseInt(costFilter.value);

    // Filter dogs by breed, age, and cost independently
    const filteredDogs = dogs.filter(dog => {
        return (
            (breed === "" || dog.breed === breed) &&  // Filter by breed if selected
            (age === "" || dog.age === age) &&        // Filter by age if selected
            dog.price <= maxCost                        // Filter by cost range
        );
    });

    displayDogs(filteredDogs); // Update the display with the filtered dogs
}

// Function to dynamically display dogs on the page
function displayDogs(dogList) {
    dogGrid.innerHTML = ""; 
    dogList.forEach(dog => {
        const dogCard = document.createElement("div");
        dogCard.classList.add("dog-card");
        dogCard.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}">
            <h3>${dog.name}</h3>
            <p>Breed: ${dog.breed}</p>
            <p>Age: ${dog.age}</p>
            <p>Cost: Rs.${dog.price}</p>
        `;
        dogGrid.appendChild(dogCard);
    });
}
