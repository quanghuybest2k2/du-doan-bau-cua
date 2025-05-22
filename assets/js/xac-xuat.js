const animals = ["Nai", "Bầu", "Gà", "Tôm", "Cua", "Cá"];
const animalImages = {
  Nai: "assets/imgs/deer.png",
  Bầu: "assets/imgs/calabash.png",
  Gà: "assets/imgs/chicken.png",
  Tôm: "assets/imgs/shrimp.png",
  Cua: "assets/imgs/crab.png",
  Cá: "assets/imgs/fish.png",
};

// Hàm chọn linh vật
function setupAnimalSelection(groupId, inputId) {
  const group = document.getElementById(groupId);
  const input = document.getElementById(inputId);
  const images = group.getElementsByClassName("animal-select");

  Array.from(images).forEach((img) => {
    img.addEventListener("click", () => {
      Array.from(images).forEach((i) =>
        i.classList.remove("ring-2", "ring-clifford")
      );
      img.classList.add("ring-2", "ring-clifford");
      input.value = animals[img.dataset.value];
    });
  });
}

// Thiết lập sự kiện chọn linh vật cho tất cả các nhóm
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    setupAnimalSelection(`game${i}-${j}-group`, `game${i}-${j}`);
  }
}

// Đóng thông báo lỗi
document.getElementById("close-error").addEventListener("click", () => {
  document.getElementById("error-message").classList.add("hidden");
});

// Hàm tính xác suất lý thuyết
function calculateProbability() {
  const probSingleDie = 1 / 6;
  const probNotAppear = Math.pow(5 / 6, 3);
  const probAtLeastOnce = 1 - probNotAppear;
  return probAtLeastOnce;
}

// Hàm phân tích lịch sử và gợi ý cược
function suggestNextBet(history) {
  const frequency = {
    Nai: 0,
    Bầu: 0,
    Gà: 0,
    Tôm: 0,
    Cua: 0,
    Cá: 0,
  };

  history.forEach((result) => {
    result.forEach((animal) => {
      if (frequency[animal] !== undefined) {
        frequency[animal]++;
      }
    });
  });

  let maxFreq = 0;
  let suggestedAnimal = "";
  for (const animal in frequency) {
    if (frequency[animal] > maxFreq) {
      maxFreq = frequency[animal];
      suggestedAnimal = animal;
    }
  }

  return {
    suggestion:
      suggestedAnimal || animals[Math.floor(Math.random() * animals.length)],
    frequency: frequency,
    probability: calculateProbability(),
  };
}

// Hàm mô phỏng lắc xúc xắc ngẫu nhiên
function rollDice() {
  const result = [];
  for (let i = 0; i < 3; i++) {
    result.push(animals[Math.floor(Math.random() * animals.length)]);
  }
  return result;
}

// Hàm reset và chuyển lịch sử
function shiftAndResetHistory() {
  // Lấy giá trị hiện tại của các ván
  const game2 = [
    document.getElementById("game2-1").value,
    document.getElementById("game2-2").value,
    document.getElementById("game2-3").value,
  ];
  const game3 = [
    document.getElementById("game3-1").value,
    document.getElementById("game3-2").value,
    document.getElementById("game3-3").value,
  ];

  // Chuyển game2 sang game1
  ["game1-1", "game1-2", "game1-3"].forEach((inputId, index) => {
    const input = document.getElementById(inputId);
    input.value = game2[index];
    const group = document.getElementById(`${inputId}-group`);
    const images = group.getElementsByClassName("animal-select");
    Array.from(images).forEach((img) => {
      img.classList.remove("ring-2", "ring-clifford");
      if (animals[img.dataset.value] === game2[index]) {
        img.classList.add("ring-2", "ring-clifford");
      }
    });
  });

  // Chuyển game3 sang game2
  ["game2-1", "game2-2", "game2-3"].forEach((inputId, index) => {
    const input = document.getElementById(inputId);
    input.value = game3[index];
    const group = document.getElementById(`${inputId}-group`);
    const images = group.getElementsByClassName("animal-select");
    Array.from(images).forEach((img) => {
      img.classList.remove("ring-2", "ring-clifford");
      if (animals[img.dataset.value] === game3[index]) {
        img.classList.add("ring-2", "ring-clifford");
      }
    });
  });

  // Reset game3
  ["game3-1", "game3-2", "game3-3"].forEach((inputId) => {
    const input = document.getElementById(inputId);
    input.value = "";
    const group = document.getElementById(`${inputId}-group`);
    const images = group.getElementsByClassName("animal-select");
    Array.from(images).forEach((img) =>
      img.classList.remove("ring-2", "ring-clifford")
    );
  });
}

// Xử lý sự kiện nút Phân tích
document.getElementById("analyze-btn").addEventListener("click", () => {
  const history = [
    [
      document.getElementById("game1-1").value,
      document.getElementById("game1-2").value,
      document.getElementById("game1-3").value,
    ],
    [
      document.getElementById("game2-1").value,
      document.getElementById("game2-2").value,
      document.getElementById("game2-3").value,
    ],
    [
      document.getElementById("game3-1").value,
      document.getElementById("game3-2").value,
      document.getElementById("game3-3").value,
    ],
  ];

  // Kiểm tra nếu thiếu lựa chọn
  const isValid = history.every((game) =>
    game.every((animal) => animal !== "")
  );
  if (!isValid) {
    document.getElementById("error-message").classList.remove("hidden");
    document.getElementById("result").classList.add("hidden");
    return;
  } else {
    document.getElementById("error-message").classList.add("hidden");
  }

  const result = suggestNextBet(history);

  // Hiển thị kết quả
  document.getElementById(
    "probability"
  ).innerText = `Xác suất một linh vật xuất hiện ít nhất 1 lần trong 3 xúc xắc: ${(
    result.probability * 100
  ).toFixed(2)}%`;

  let freqText = "Tần suất xuất hiện trong 3 ván trước:\n";
  for (const animal in result.frequency) {
    freqText += `${animal}: ${result.frequency[animal]} lần\n`;
  }
  document.getElementById("frequency").innerText = freqText;

  document.getElementById(
    "suggestion"
  ).innerText = `Gợi ý cược cho ván tiếp theo (dựa trên tần suất): ${result.suggestion}`;

  // Hiển thị hình ảnh linh vật gợi ý
  const suggestedImage = document.getElementById("suggestedImage");
  suggestedImage.src = animalImages[result.suggestion];
  suggestedImage.classList.remove("hidden");

  document.getElementById("result").classList.remove("hidden");

  // Chuyển lịch sử và reset ván 3
  shiftAndResetHistory();
});
