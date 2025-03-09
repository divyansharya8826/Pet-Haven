document.addEventListener("DOMContentLoaded", function () {
    fetchDogs();
});

// Fetch and display all dogs
function fetchDogs() {
    fetch("/api/dogs")
        .then(response => response.json())
        .then(data => {
            const dogList = document.getElementById("dog-list");
            dogList.innerHTML = ""; 
            data.forEach(dog => {
                const dogItem = document.createElement("div");
                dogItem.classList.add("dog-item");
                dogItem.innerHTML = `
                    <img src="${dog.image}" alt="${dog.name}">
                    <h3>${dog.name}</h3>
                    <p>Breed: ${dog.breed}</p>
                    <p>Age: ${dog.age} years</p>
                    <p>Price: ₹${dog.price}</p>
                    <p>${dog.description}</p>
                    <button onclick="editDog('${dog.id}')">Edit</button>
                    <button onclick="deleteDog('${dog.id}')">Delete</button>
                `;
                dogList.appendChild(dogItem);
            });
        })
        .catch(error => console.error("Error fetching dogs:", error));
}

// Delete a dog
function deleteDog(dogId) {
    if (confirm("Are you sure you want to delete this dog?")) {
        fetch(`/admin/dogs/${dogId}`, { method: "DELETE" })
            .then(response => response.json())
            .then(() => {
                alert("Dog deleted successfully!");
                fetchDogs();
            })
            .catch(error => console.error("Error deleting dog:", error));
    }
}

// Show add dog form
function showAddDogForm() {
    document.getElementById("add-dog-form").classList.toggle("hidden");
}

// Add a new dog
document.getElementById("dog-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const dogData = {
        name: document.getElementById("dog-name").value.trim(),
        breed: document.getElementById("dog-breed").value.trim(),
        age: document.getElementById("dog-age").value.trim(),
        price: document.getElementById("dog-price").value.trim(),
        image: document.getElementById("dog-image").value.trim(),
        description: document.getElementById("dog-description").value.trim()
    };

    fetch("/admin/dogs/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dogData)
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById("dog-form").reset();
        alert("Dog added successfully!");
        fetchDogs();
    })
    .catch(error => console.error("Error adding dog:", error));
});

// Edit a dog
function editDog(dogId) {
    const newName = prompt("Enter new name:");
    const newPrice = prompt("Enter new price:");

    if (newName && newPrice) {
        fetch(`/admin/dogs/update/${dogId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName, price: newPrice })
        })
        .then(response => response.json())
        .then(() => {
            alert("Dog updated successfully!");
            fetchDogs();
        })
        .catch(error => console.error("Error updating dog:", error));
    }
}
