const words = {
    voyage: ["AVION", "VALISE", "PLAGE", "HOTEL", "PASSEPORT"],
    travail: ["BUREAU", "REUNION", "ORDINATEUR", "COLLEGUE", "PROJET"],
    sante: ["HOPITAL", "MEDECIN", "MEDICAMENT", "PATIENT", "INFIRMIER"],
    maison: ["CUISINE", "SALON", "CHAMBRE", "JARDIN", "GARAGE"],
    loisir: ["CINEMA", "LECTURE", "SPORT", "MUSIQUE", "VOYAGE"],
    famille: ["PARENTS", "ENFANTS", "FRERE", "SŒUR", "COUSIN"],
    alimentation: ["LEGUME", "FRUIT", "VIANDE", "POISSON", "DESSERT"]
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

const wordElement = document.getElementById("word");
const hangmanElement = document.getElementById("hangman");
const vowelsElement = document.getElementById("vowels");
const consonants1Element = document.getElementById("consonants1");
const consonants2Element = document.getElementById("consonants2");
const restartButton = document.getElementById("restart");

function initializeGame(selectedCategory) {
    category = selectedCategory;
    currentWord = words[category][Math.floor(Math.random() * words[category].length)];
    guessedWord = Array(currentWord.length).fill("_");
    remainingLives = 6;
    
    wordElement.textContent = guessedWord.join(" ");
    hangmanElement.textContent = hangmanStages[0];
    
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
        if (currentWord.includes(letter)) {
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
    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === letter) {
            guessedWord[i] = letter;
        }
    }
    wordElement.textContent = guessedWord.join(" ");
}

function updateHangman() {
    hangmanElement.textContent = hangmanStages[6 - remainingLives];
}

function checkGameStatus() {
    if (!guessedWord.includes("_")) {
        alert("Félicitations ! Vous avez gagné !");
    } else if (remainingLives === 0) {
        alert("Dommage ! Vous avez perdu. Le mot était : " + currentWord);
    }
}

document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        initializeGame(button.dataset.category);
    });
});

restartButton.addEventListener("click", () => {
    initializeGame(category);
});

// Initialisation du jeu avec la catégorie "voyage" par défaut
initializeGame("voyage");