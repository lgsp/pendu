const words = {
    general: [
        {fr: "être", en: "to be"},
        {fr: "avoir", en: "to have"},
        {fr: "faire", en: "to do"},
        {fr: "dire", en: "to say"},
        {fr: "aller", en: "to go"}
    ],
    animaux: [
        {fr: "chien", en: "dog"},
        {fr: "chat", en: "cat"},
        {fr: "oiseau", en: "bird"},
        {fr: "poisson", en: "fish"},
        {fr: "cheval", en: "horse"}
    ],
    nourriture: [
        {fr: "pain", en: "bread"},
        {fr: "fromage", en: "cheese"},
        {fr: "pomme", en: "apple"},
        {fr: "viande", en: "meat"},
        {fr: "eau", en: "water"}
    ],
    couleurs: [
        {fr: "rouge", en: "red"},
        {fr: "bleu", en: "blue"},
        {fr: "vert", en: "green"},
        {fr: "jaune", en: "yellow"},
        {fr: "noir", en: "black"}
    ],
    famille: [
        {fr: "mère", en: "mother"},
        {fr: "père", en: "father"},
        {fr: "frère", en: "brother"},
        {fr: "sœur", en: "sister"},
        {fr: "enfant", en: "child"}
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



// ... (le reste du code reste inchangé jusqu'à la fonction createLetterButtons)

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
    if (remainingLives > 0 && guessedWord.includes("_") && !button.classList.contains("correct") && !button.classList.contains("incorrect")) {
        if (currentWord.fr.toLowerCase().includes(letter.toLowerCase())) {
            updateGuessedWord(letter);
            button.classList.add("correct");
        } else {
            remainingLives--;
            livesElement.textContent = remainingLives;
            updateHangman();
            button.classList.add("incorrect");
        }
        
        checkGameStatus();
    }
}

function updateHangman() {
    const hangmanIndex = hangmanStages.length - 1 - remainingLives;
    hangmanElement.textContent = hangmanStages[hangmanIndex];
}

// ... (le reste du code reste inchangé)

function updateGuessedWord(letter) {
    for (let i = 0; i < currentWord.fr.length; i++) {
        if (currentWord.fr[i].toLowerCase() === letter.toLowerCase()) {
            guessedWord[i] = currentWord.fr[i];
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

initializeGame("general", "easy");