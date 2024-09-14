const words = {
    voyage: [
        {fr: "AVION", en: "plane"},
        {fr: "VALISE", en: "suitcase"},
        {fr: "PLAGE", en: "beach"},
        {fr: "HOTEL", en: "hotel"},
        {fr: "PASSEPORT", en: "passport"}
    ],
    travail: [
        {fr: "BUREAU", en: "office"},
        {fr: "REUNION", en: "meeting"},
        {fr: "ORDINATEUR", en: "computer"},
        {fr: "COLLEGUE", en: "colleague"},
        {fr: "PROJET", en: "project"}
    ],
    sante: [
        {fr: "HOPITAL", en: "hospital"},
        {fr: "MEDECIN", en: "doctor"},
        {fr: "MEDICAMENT", en: "medicine"},
        {fr: "PATIENT", en: "patient"},
        {fr: "INFIRMIER", en: "nurse"}
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
    famille: [
        {fr: "PARENTS", en: "parents"},
        {fr: "ENFANTS", en: "children"},
        {fr: "FRERE", en: "brother"},
        {fr: "SŒUR", en: "sister"},
        {fr: "COUSIN", en: "cousin"}
    ],
    alimentation: [
        {fr: "LEGUME", en: "vegetable"},
        {fr: "FRUIT", en: "fruit"},
        {fr: "VIANDE", en: "meat"},
        {fr: "POISSON", en: "fish"},
        {fr: "DESSERT", en: "dessert"}
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
const hangmanElement = document.getElementById("hangman");
const vowelsElement = document.getElementById("vowels");
const consonants1Element = document.getElementById("consonants1");
const consonants2Element = document.getElementById("consonants2");
const restartButton = document.getElementById("restart");
const resultElement = document.getElementById("result");
const translationElement = document.getElementById("translation");

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
    hangmanElement.textContent = hangmanStages[0];
    resultElement.textContent = "";
    translationElement.textContent = "";
    resultElement.className = "";
    translationElement.className = "";
    
    createLetterButtons();
}

function createLetterButtons() {
    const vowels = ['A', 'E', 'I', 'O', 'U', 'Y'];
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'];
    
    vowelsElement.innerHTML = "";
    consonants1Element.innerHTML = "";
    consonants2Element.innerHTML = "";

    vowels.forEach(letter => {
        const button = createLetterButton(letter);
        vowelsElement.appendChild(button);
    });

    consonants.forEach((letter, index) => {
        const button = createLetterButton(letter);
        if (index < 10) {
            consonants1Element.appendChild(button);
        } else {
            consonants2Element.appendChild(button);
        }
    });
}

function createLetterButton(letter) {
    const button = document.createElement("button");
    button.textContent = letter;
    button.addEventListener("click", () => guessLetter(letter, button));
    return button;
}

function guessLetter(letter, button) {
    if (!button.classList.contains("correct") && !button.classList.contains("incorrect")) {
        if (currentWord.fr.includes(letter)) {
            updateGuessedWord(letter);
            button.classList.add("correct");
        } else {
            remainingLives--;
            updateHangman();
            button.classList.add("incorrect");
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

function updateHangman() {
    hangmanElement.textContent = hangmanStages[hangmanStages.length - 1 - remainingLives];
}

function checkGameStatus() {
    if (!guessedWord.includes("_")) {
        showResult("win");
    } else if (remainingLives === 0) {
        showResult("lose");
    }
}

function showResult(status) {
    if (status === "win") {
        resultElement.textContent = "Félicitations ! Vous avez gagné !";
        resultElement.className = "win";
    } else {
        resultElement.textContent = "Dommage ! Vous avez perdu.";
        resultElement.className = "lose";
    }
    translationElement.textContent = `Le mot était : ${currentWord.fr} (${currentWord.en})`;
    translationElement.className = status;
}

document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category.active")?.classList.remove("active");
        button.classList.add("active");
        initializeGame(button.dataset.category, difficulty);
    });
});

document.querySelectorAll(".difficulty-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".difficulty-btn.active")?.classList.remove("active");
        button.classList.add("active");
        difficulty = button.dataset.difficulty;
    });
});

restartButton.addEventListener("click", () => {
    initializeGame(category, difficulty);
});

// Initialisation du jeu avec la catégorie "voyage" et la difficulté "facile" par défaut
initializeGame("voyage", "facile");
document.querySelector(".category[data-category='voyage']").classList.add("active");
document.querySelector(".difficulty-btn[data-difficulty='facile']").classList.add("active");