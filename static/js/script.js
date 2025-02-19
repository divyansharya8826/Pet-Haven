document.addEventListener("DOMContentLoaded", function () {
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
    });
  }
});
