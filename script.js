const dogs = [
    { name: "Buddy", breed: "Labrador", age: "Puppy", cost: 1500, img: "https://doggywala.com/assets/images/labrador-retriever/labrador4.jpg" },
    { name: "Bella", breed: "Bulldog", age: "Adult", cost: 2000, img: "https://i1.pickpik.com/photos/94/974/364/bulldog-cute-easter-animal-preview.jpg" },
    { name: "Charlie", breed: "Poodle", age: "Senior", cost: 1200, img: "https://www.argentcymrustandardpoodles.com/uploads/1/4/7/8/14787088/20240829-r2a1625-cr3-3-2048-1_orig.jpg" },
    { name: "Max", breed: "Labrador", age: "Adult", cost: 1800, img: "https://www.carecredit.com/sites/cc/image/article_hero_lab_retriever.jpg" },
    { name: "Lucy", breed: "Bulldog", age: "Puppy", cost: 2200, img: "https://preview.redd.it/this-cute-english-bulldog-puppy-v0-ud3fusjz8n9d1.jpeg?width=640&crop=smart&auto=webp&s=43d130c8b5e78bc20b76613466ce78ca785e4011" },
    { name: "Daisy", breed: "Poodle", age: "Adult", cost: 2500, img: "https://thehappypuppysite.com/wp-content/uploads/2019/04/cream-toy-poodle.jpg" },
];

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
            dog.cost <= maxCost                        // Filter by cost range
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
            <img src="${dog.img}" alt="${dog.name}">
            <h3>${dog.name}</h3>
            <p>Breed: ${dog.breed}</p>
            <p>Age: ${dog.age}</p>
            <p>Cost: Rs.${dog.cost}</p>
        `;
        dogGrid.appendChild(dogCard);
    });
}

// Initialize with all dogs displayed
displayDogs(dogs);
