// Mapping of numbers to animals and their images
const animalMap = {
  0: { name: "Nai", image: "assets/imgs/deer.png" },
  1: { name: "Bầu", image: "assets/imgs/calabash.png" },
  2: { name: "Gà", image: "assets/imgs/chicken.png" },
  3: { name: "Tôm", image: "assets/imgs/shrimp.png" },
  4: { name: "Cua", image: "assets/imgs/crab.png" },
  5: { name: "Cá", image: "assets/imgs/fish.png" },
};

// Prediction logic
function predictNextAnimal(animal1, animal2, animal3) {
  const sum = parseInt(animal1) + parseInt(animal2) + parseInt(animal3) + 3;
  let result = sum;
  if (sum < 12) {
    result -= 6;
  } else {
    result -= 12;
  }
  // Ensure result is within 0-5
  result = ((result % 6) + 6) % 6;
  return result;
}

// Handle image selection
const groups = ["animal1-group", "animal2-group", "animal3-group"];
groups.forEach((groupId) => {
  const images = document.querySelectorAll(`#${groupId} .animal-select`);
  images.forEach((img) => {
    img.addEventListener("click", () => {
      // Remove selection from other images in the same group
      images.forEach((i) => i.classList.remove("ring-2", "ring-clifford"));
      // Highlight selected image
      img.classList.add("ring-2", "ring-clifford");
      // Update hidden input
      document.getElementById(groupId.replace("-group", "")).value =
        img.dataset.value;
      // Hide error message when an animal is selected
      document.getElementById("error-message").classList.add("hidden");
    });
  });
});

// Handle predict button click
document.getElementById("predictBtn").addEventListener("click", () => {
  const animal1 = document.getElementById("animal1").value;
  const animal2 = document.getElementById("animal2").value;
  const animal3 = document.getElementById("animal3").value;

  // Check if all animals are selected
  if (animal1 === "" || animal2 === "" || animal3 === "") {
    document.getElementById("error-message").classList.remove("hidden");
    return;
  }

  const predictedIndex = predictNextAnimal(animal1, animal2, animal3);
  const predictedAnimal = animalMap[predictedIndex];

  // Display result
  document.getElementById("predictedAnimal").textContent = predictedAnimal.name;
  document.getElementById("predictedImage").src = predictedAnimal.image;
  document.getElementById("result").classList.remove("hidden");
});

// Handle close error button
document.getElementById("close-error").addEventListener("click", () => {
  document.getElementById("error-message").classList.add("hidden");
});
