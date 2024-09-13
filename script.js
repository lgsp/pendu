const words = {
    general: [
        {fr: "ETRE", en: "to be"},
        {fr: "AVOIR", en: "to have"},
        {fr: "FAIRE", en: "to do"},
        {fr: "DIRE", en: "to say"},
        {fr: "ALLER", en: "to go"}
    ],
    animaux: [
        {fr: "CHIEN", en: "dog"},
        {fr: "CHAT", en: "cat"},
        {fr: "OISEAU", en: "bird"},
        {fr: "POISSON", en: "fish"},
        {fr: "CHEVAL", en: "horse"}
    ],
    nourriture: [
        {fr: "PAIN", en: "bread"},
        {fr: "FROMAGE", en: "cheese"},
        {fr: "POMME", en: "apple"},
        {fr: "VIANDE", en: "meat"},
        {fr: "EAU", en: "water"}
    ],
    couleurs: [
        {fr: "ROUGE", en: "red"},
        {fr: "BLEU", en: "blue"},
        {fr: "VERT", en: "green"},
        {fr: "JAUNE", en: "yellow"},
        {fr: "NOIR", en: "black"}
    ],
    famille: [
        {fr: "MERE", en: "mother"},
        {fr: "PERE", en: "father"},
        {fr: "FRERE", en: "brother"},
        {fr: "SŒUR", en: "sister"},
        {fr: "ENFANT", en: "child"}
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
        case "easy":
            remainingLives = currentWord.fr.length * 2;
            break;
        case "medium":
            remainingLives = Math.ceil(currentWord.fr.length * 1.5);
            break;
        case "hard":
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
    const vowels = ['A', 'E', 'I', 'O', 'U', 'Y'];
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'];
    
    // Créer une ligne pour les voyelles
    const vowelRow = document.createElement('div');
    vowelRow.className = 'letter-row';
    vowels.forEach(letter => {
        const button = createLetterButton(letter);
        vowelRow.appendChild(button);
    });
    lettersElement.appendChild(vowelRow);
    
    // Créer 4 lignes de 5 consonnes
    for (let i = 0; i < 4; i++) {
        const consonantRow = document.createElement('div');
        consonantRow.className = 'letter-row';
        for (let j = 0; j < 5; j++) {
            const index = i * 5 + j;
            if (index < consonants.length) {
                const button = createLetterButton(consonants[index]);
                consonantRow.appendChild(button);
            }
        }
        lettersElement.appendChild(consonantRow);
    }
}

function createLetterButton(letter) {
    const button = document.createElement("button");
    button.textContent = letter;
    button.addEventListener("click", () => guessLetter(letter, button));
    return button;
}

function guessLetter(letter, button) {
    if (remainingLives > 0 && guessedWord.includes("_") && !button.disabled) {
        button.disabled = true; // Désactive le bouton après le clic
        if (currentWord.fr.includes(letter)) {
            updateGuessedWord(letter);
            button.classList.add("correct");
            button.style.backgroundColor = "#28a745"; // Vert pour les lettres correctes
        } else {
            remainingLives--;
            livesElement.textContent = remainingLives;
            updateHangman();
            button.classList.add("incorrect");
            button.style.backgroundColor = "#dc3545"; // Rouge pour les lettres incorrectes
        }
        
        checkGameStatus();
    }
}


function updateGuessedWord(letter) {
    const normalizedWord = normalizeString(currentWord.fr);
    for (let i = 0; i < normalizedWord.length; i++) {
        if (normalizedWord[i] === letter) {
            guessedWord[i] = currentWord.fr[i]; // Afficher en majuscules
        }
    }
    wordElement.textContent = guessedWord.join(" ");
}

function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(); // Retire les accents et met en majuscules
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

// Écouteurs d'événements pour les catégories et les niveaux de difficulté
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

// Initialisation du jeu
initializeGame("general", "easy");