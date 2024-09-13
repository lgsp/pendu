const words = {
    travail: [
        {fr: "BUREAU", en: "office"},
        {fr: "REUNION", en: "meeting"},
        {fr: "ORDINATEUR", en: "computer"},
        {fr: "COLLEGUE", en: "colleague"},
        {fr: "PROJET", en: "project"}
    ],
    maison: [
        {fr: "CUISINE", en: "kitchen"},
        {fr: "SALON", en: "living room"},
        {fr: "CHAMBRE", en: "bedroom"},
        {fr: "JARDIN", en: "garden"},
        {fr: "GARAGE", en: "garage"}
    ],
    loisir: [
        {fr: "CINEMA", en: "cinema"},
        {fr: "LECTURE", en: "reading"},
        {fr: "SPORT", en: "sport"},
        {fr: "MUSIQUE", en: "music"},
        {fr: "VOYAGE", en: "travel"}
    ],
    alimentation: [
        {fr: "LEGUME", en: "vegetable"},
        {fr: "FRUIT", en: "fruit"},
        {fr: "VIANDE", en: "meat"},
        {fr: "POISSON", en: "fish"},
        {fr: "DESSERT", en: "dessert"}
    ],
    voyage: [
        {fr: "AVION", en: "plane"},
        {fr: "HOTEL", en: "hotel"},
        {fr: "PLAGE", en: "beach"},
        {fr: "PASSEPORT", en: "passport"},
        {fr: "VALISE", en: "suitcase"}
    ]
};

const hangmanStages = [
    `
  +---+
  |   |
      |
      |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

let currentWord;
let guessedWord;
let remainingLives;
let category;
let difficulty;

const wordElement = document.getElementById("word");
const lettersElement = document.getElementById("letters");
const livesElement = document.getElementById("remainingLives");
const messageElement = document.getElementById("message");
const fullWordElement = document.getElementById("fullWord");
const translationElement = document.getElementById("translation");
const restartButton = document.getElementById("restart");
const hangmanElement = document.getElementById("hangman");

function initializeGame(selectedCategory, selectedDifficulty) {
    category = selectedCategory;
    difficulty = selectedDifficulty;
    currentWord = words[category][Math.floor(Math.random() * words[category].length)];
    guessedWord = Array(currentWord.fr.length).fill("_");
    
    switch(difficulty) {
        case "facile":
            remainingLives = currentWord.fr.length * 2;
            break;
        case "moyen":
            remainingLives = Math.ceil(currentWord.fr.length * 1.5);
            break;
        case "difficile":
            remainingLives = currentWord.fr.length;
            break;
    }
    
    wordElement.textContent = guessedWord.join(" ");
    livesElement.textContent = remainingLives;
    messageElement.textContent = "";
    fullWordElement.textContent = "";
    translationElement.textContent = "";
    hangmanElement.textContent = hangmanStages[0];
    
    createLetterButtons();
}

function createLetterButtons() {
    lettersElement.innerHTML = "";
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let i = 0; i < 2; i++) {
        const row = document.createElement('div');
        row.className = 'letter-row';
        for (let j = 0; j < 13; j++) {
            const index = i * 13 + j;
            if (index < letters.length) {
                const button = document.createElement("button");
                button.textContent = letters[index];
                button.addEventListener("click", () => guessLetter(letters[index], button));
                row.appendChild(button);
            }
        }
        lettersElement.appendChild(row);
    }
}

function guessLetter(letter, button) {
    if (remainingLives > 0 && guessedWord.includes("_") && !button.classList.contains("guessed")) {
        button.classList.add("guessed");
        if (currentWord.fr.includes(letter)) {
            updateGuessedWord(letter);
            button.style.backgroundColor = "#28a745"; // Vert pour les lettres correctes
        } else {
            remainingLives--;
            livesElement.textContent = remainingLives;
            hangmanElement.textContent = hangmanStages[hangmanStages.length - 1 - remainingLives];
            button.style.backgroundColor = "#dc3545"; // Rouge pour les lettres incorrectes
        }
        
        checkGameStatus();
    }
}

function updateGuessedWord(letter) {
    for (let i = 0; i < currentWord.fr.length; i++) {
        if (currentWord.fr[i] === letter) {
            guessedWord[i] = letter;
        }
    }
    wordElement.textContent = guessedWord.join(" ");
}

function checkGameStatus() {
    if (!guessedWord.includes("_")) {
        messageElement.textContent = "Félicitations ! Vous avez gagné !";
        showFullWordAndTranslation("win");
    } else if (remainingLives === 0) {
        messageElement.textContent = "Dommage ! Vous avez perdu.";
        showFullWordAndTranslation("lose");
    }
}

function showFullWordAndTranslation(result) {
    fullWordElement.textContent = `Le mot était : ${currentWord.fr}`;
    translationElement.textContent = `Traduction : ${currentWord.en}`;
    fullWordElement.classList.add(result);
    translationElement.classList.add(result);
}

document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category.active").classList.remove("active");
        button.classList.add("active");
        initializeGame(button.dataset.category, difficulty);
    });
});

document.querySelectorAll(".difficulty-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".difficulty-btn.active").classList.remove("active");
        button.classList.add("active");
        initializeGame(category, button.dataset.difficulty);
    });
});

restartButton.addEventListener("click", () => {
    initializeGame(category, difficulty);
});

initializeGame("travail", "facile");