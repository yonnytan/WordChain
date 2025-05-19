// Dark Mode Toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");
const html = document.documentElement;

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

// Print system theme preference
console.log("System prefers dark mode:", systemPrefersDark);
console.log("Current system theme:", systemPrefersDark ? "dark" : "light");

// Set initial theme
if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
  html.classList.add("dark");
}

// Toggle dark mode
darkModeToggle.addEventListener("click", () => {
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  // Update the icon - using a more robust selector
  const moonPath = darkModeToggle.querySelector("path:not(.hidden)");
  const sunPath = darkModeToggle.querySelector("path.hidden");

  if (moonPath && sunPath) {
    moonPath.classList.toggle("hidden");
    sunPath.classList.toggle("hidden");
  }
});

// Setup typing animation
document.addEventListener("DOMContentLoaded", function () {
  const typingElement = document.getElementById("typing-animation");

  if (typingElement) {
    // Words to type in sequence with their colors
    const wordsToType = [
      { word: "cat", color: "blue" },
      { word: "tiger", color: "purple" },
      { word: "raven", color: "indigo" },
    ];

    // Function for typewriter effect
    function typeWriter(element, words, wordIndex = 0, charIndex = 0) {
      // Current word data
      const currentWordObj = words[wordIndex];
      const currentWord = currentWordObj.word;
      const currentColor = currentWordObj.color;

      // Speed settings
      const typingSpeed = 100; // Speed of typing
      const pauseBetweenWords = 800; // Pause after word is typed

      // Build display text
      let displayText = "";

      // Add previously completed words with arrows
      for (let i = 0; i < wordIndex; i++) {
        displayText += `<span class="text-${words[i].color}-500 dark:text-${
          words[i].color
        }-400">${formatWordWithLastLetterUnderlined(words[i].word)}</span>`;
        if (i < words.length - 1) {
          displayText += ` <span class="text-gray-700 dark:text-white">→</span> `;
        }
      }

      // Add current word being typed
      if (wordIndex < words.length) {
        if (charIndex > 0) {
          if (wordIndex > 0) {
            displayText += ` <span class="text-gray-700 dark:text-white">→</span> `;
          }

          // Handle the currently typing word with possibly underlined last letter
          const currentTypedPart = currentWord.substring(0, charIndex);
          // If we're typing the last character, underline it
          const formattedTypedPart =
            formatPartialWordWithLastLetterUnderlined(currentTypedPart);

          displayText += `<span class="text-${currentColor}-500 dark:text-${currentColor}-400">${formattedTypedPart}</span>`;
        }
      }

      // Update the element's content
      element.innerHTML = displayText;

      // Determine next step
      if (charIndex < currentWord.length) {
        // Continue typing current word
        setTimeout(() => {
          typeWriter(element, words, wordIndex, charIndex + 1);
        }, typingSpeed);
      } else if (wordIndex < words.length - 1) {
        // Move to next word
        setTimeout(() => {
          typeWriter(element, words, wordIndex + 1, 0);
        }, pauseBetweenWords);
      } else {
        // Animation complete
        element.classList.add("finished");

        // Optional: restart animation after a longer pause
        setTimeout(() => {
          element.classList.remove("finished");
          typeWriter(element, words, 0, 0);
        }, 5000);
      }
    }

    // Helper function to format a word with its last letter underlined
    function formatWordWithLastLetterUnderlined(word) {
      if (word.length <= 1) return word;

      const lastChar = word.charAt(word.length - 1);
      const restOfWord = word.substring(0, word.length - 1);

      return `${restOfWord}<u>${lastChar.toUpperCase()}</u>`;
    }

    // Helper function to properly format a partially typed word
    function formatPartialWordWithLastLetterUnderlined(typedPart) {
      if (typedPart.length <= 1) return typedPart;

      const lastChar = typedPart.charAt(typedPart.length - 1);
      const restOfTyped = typedPart.substring(0, typedPart.length - 1);

      return `${restOfTyped}<u>${lastChar.toUpperCase()}</u>`;
    }

    // Start the typing animation
    setTimeout(() => {
      typeWriter(typingElement, wordsToType);
    }, 1000); // Short delay before starting
  }
});

// Game state
let currentLetter = "";
let score = 0;
let timeLeft = 30;
let defaultTime = 30;
let timer;
let wordHistory = [];

// Initialize stats with proper structure or get from localStorage
let stats;
try {
  const savedStats = localStorage.getItem("wordChainStats");
  if (savedStats) {
    stats = JSON.parse(savedStats);
    // Ensure proper structure
    if (!stats.timeStats) {
      stats = {
        timeStats: {
          15: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
          30: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
          45: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
          60: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
          90: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
          120: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
        },
      };
    }
  } else {
    stats = {
      timeStats: {
        15: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
        30: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
        45: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
        60: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
        90: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
        120: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
      },
    };
  }
} catch (e) {
  console.error("Error loading stats:", e);
  stats = {
    timeStats: {
      15: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
      30: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
      45: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
      60: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
      90: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
      120: { gamesPlayed: 0, bestScore: 0, totalWords: 0 },
    },
  };
}

// Word validation state
let validWordsList = null;
let isWordListLoading = true;

// DOM elements
const titlePage = document.getElementById("title-page");
const gamePage = document.getElementById("game-page");
const startGameButton = document.getElementById("start-game");
const timeDisplay = document.getElementById("time");
const currentLetterDisplay = document.getElementById("current-letter");
const scoreDisplay = document.getElementById("score");
const wordInput = document.getElementById("word-input");
const submitButton = document.getElementById("submit-word");
const wordHistoryContainer = document.getElementById("word-history");
const wordHint = document.getElementById("word-hint");
const endModal = document.getElementById("end-modal");
const playAgainButton = document.getElementById("play-again");
const viewStatsButton = document.getElementById("view-stats");
const startRoundButton = document.getElementById("start-round");
const timeSelect = document.getElementById("time-select");
const gameControls = document.querySelector(".game-controls");
const statsModal = document.getElementById("stats-modal");
const closeStatsButton = document.getElementById("close-stats");

// Generate a random letter
function getRandomLetter() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

// Page navigation
startGameButton.addEventListener("click", () => {
  titlePage.classList.remove("active");
  gamePage.classList.add("active");
  initGame();
});

// Initialize game
function initGame() {
  currentLetter = getRandomLetter();
  score = 0;
  defaultTime = parseInt(timeSelect.value, 10);
  timeLeft = defaultTime;
  wordHistory = [];
  wordHistoryContainer.innerHTML = "";
  updateDisplay();
  wordInput.focus();
  wordInput.disabled = true;
  submitButton.disabled = true;
  startRoundButton.disabled = false;
  wordHint.textContent = "Press Go to start!";
  wordHint.classList.remove("get-ready-text");
  wordHint.className =
    "text-xl text-gray-800 dark:text-gray-200 font-medium mb-4 sm:mb-6 text-center";

  // Hide the current letter initially
  currentLetterDisplay.classList.add("hidden");

  if (gameControls) {
    gameControls.classList.remove("hidden");
  }
}

// Update all displays
function updateDisplay() {
  currentLetterDisplay.textContent = currentLetter;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = `${timeLeft}s`;

  // Only update the hint with the current letter if the game has started
  if (
    wordHint.textContent !== "Get ready..." &&
    wordHint.textContent !== "Press Go to start!" &&
    !wordInput.disabled // Only show current letter when input is enabled (game started)
  ) {
    wordHint.textContent = `Start your word with '${currentLetter}'!`;
  }

  // Reset timer warning state when updating display
  if (timeLeft > 5) {
    timeDisplay.classList.remove("timer-warning");
  }
}

// Start the countdown timer
function startTimer() {
  clearInterval(timer);
  timeLeft = defaultTime;
  updateDisplay();
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = `${timeLeft}s`;
    console.log("Timer:", timeLeft); // Debug timer

    // Add warning effect when time is low
    if (timeLeft <= 5) {
      timeDisplay.classList.add("timer-warning");
    } else {
      timeDisplay.classList.remove("timer-warning");
    }

    if (timeLeft <= 0) {
      console.log("Timer reached 0, ending game"); // Debug endGame trigger
      clearInterval(timer); // Make sure timer stops
      endGame();
    }
  }, 1000);
}

// Load valid words list when the script loads
fetch("ValidWords.txt")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load word list");
    }
    return response.text();
  })
  .then((text) => {
    // Split by newlines and filter out empty lines and whitespace
    const words = text
      .split("\n")
      .map((word) => word.trim())
      .filter((word) => word.length > 0);

    validWordsList = new Set(words.map((word) => word.toLowerCase()));
    isWordListLoading = false;
    console.log("Word list loaded successfully");
  })
  .catch((error) => {
    console.error("Error loading word list:", error);
    isWordListLoading = false;
    alert("Error loading word list. Please refresh the page to try again.");
  });

// Check if a word is valid
async function isValidWord(word, currentLetter, wordHistory) {
  const cleanedWord = word.trim().toLowerCase();
  console.log(
    "Word in list:",
    validWordsList ? validWordsList.has(cleanedWord) : "N/A"
  );

  // Basic validation
  if (
    cleanedWord.length < 2 ||
    cleanedWord[0] !== currentLetter.toLowerCase() ||
    wordHistory.includes(cleanedWord)
  ) {
    console.log("Failed basic validation");
    return false;
  }

  // Check if word list is loaded
  if (isWordListLoading) {
    showError("Word list is still loading. Please wait...");
    return false;
  }

  if (!validWordsList) {
    showError("Word list failed to load. Please refresh the page.");
    return false;
  }

  // Check if word exists in our loaded word list
  const isValid = validWordsList.has(cleanedWord);
  return isValid;
}

// Update word history display
function addWordToHistory(word) {
  const wordElement = document.createElement("div");
  wordElement.textContent = word;
  wordElement.className = "text-gray-800 dark:text-gray-200 py-2"; // Add dark mode text color

  // Add the last letter as a data attribute for styling
  const lastLetter = word.slice(-1).toUpperCase();
  wordElement.setAttribute("data-letter", lastLetter);

  wordHistoryContainer.insertBefore(
    wordElement,
    wordHistoryContainer.firstChild
  );
}

// Handle word submission
async function submitWord() {
  const word = wordInput.value.trim().toLowerCase();

  // Basic validation first
  if (word.length < 2) {
    showError("Word must be at least 2 letters long!");
    return;
  }

  if (word[0].toLowerCase() !== currentLetter.toLowerCase()) {
    showError(`Word must start with '${currentLetter.toUpperCase()}'!`);
    return;
  }

  if (wordHistory.includes(word.toLowerCase())) {
    showError("You've already used this word!");
    return;
  }

  // Check if word exists in our word list
  if (await isValidWord(word, currentLetter, wordHistory)) {
    // Valid word
    wordInput.classList.add("valid");
    setTimeout(() => wordInput.classList.remove("valid"), 500);

    // Update game state - set currentLetter to the last letter of the word
    currentLetter = word.slice(-1).toUpperCase();
    score++;
    wordHistory.unshift(word);

    // Add word to history with proper styling
    addWordToHistory(word);

    // Clear input and error message
    wordInput.value = "";
    wordHint.textContent = `Start your word with '${currentLetter}'!`;
    wordHint.className =
      "text-xl text-gray-600 dark:text-gray-300 font-medium mb-4 sm:mb-6 text-center"; // Ensure text remains centered with consistent size
    updateDisplay();
  } else {
    showError("Not a valid word!");
  }
}

// Show error message with red styling and shake animation
function showError(message) {
  wordInput.classList.add("invalid");
  wordHint.textContent = message;
  // Add Tailwind classes for red text and shake animation
  wordHint.className =
    "text-xl text-red-600 dark:text-red-400 font-medium mb-4 sm:mb-6 shake text-center";

  setTimeout(() => {
    wordInput.classList.remove("invalid");
    // Reset to normal text color and remove shake animation
    wordHint.className =
      "text-xl text-gray-600 dark:text-gray-300 font-medium mb-4 sm:mb-6 text-center";
    wordHint.textContent = `Start your word with '${currentLetter}'!`;
  }, 2000);
}

// End the game
function endGame() {
  console.log("endGame called");
  clearInterval(timer);
  wordInput.disabled = true;
  submitButton.disabled = true;
  startRoundButton.disabled = true;

  // Make sure the end modal is shown
  const endModal = document.getElementById("end-modal");
  endModal.classList.remove("hidden");

  // Update final score
  const finalScoreDisplay = document.getElementById("final-score");
  finalScoreDisplay.textContent = score;

  // Update stats for current time setting
  const timeKey = defaultTime.toString();
  if (!stats.timeStats[timeKey]) {
    stats.timeStats[timeKey] = { gamesPlayed: 0, bestScore: 0, totalWords: 0 };
  }

  const currentTimeStats = stats.timeStats[timeKey];
  currentTimeStats.gamesPlayed++;
  currentTimeStats.totalWords += score;
  if (score > currentTimeStats.bestScore) {
    currentTimeStats.bestScore = score;
  }

  // Save to localStorage
  try {
    localStorage.setItem("wordChainStats", JSON.stringify(stats));
  } catch (e) {
    console.error("Error saving stats:", e);
  }

  // Update stats display if stats modal is visible
  if (!document.getElementById("stats-modal").classList.contains("hidden")) {
    updateStatsDisplay(timeKey);
  }
}

// Event listeners
submitButton.addEventListener("click", submitWord);
wordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !wordInput.disabled) {
    submitWord();
  }
});

playAgainButton.addEventListener("click", () => {
  endModal.classList.add("hidden");
  wordInput.value = "";
  const gameControls = document.querySelector(".game-controls");
  if (gameControls) {
    gameControls.classList.remove("hidden");
  }
  initGame();
});

// Event listeners for stats modal
viewStatsButton.addEventListener("click", () => {
  // Show stats for the current game time
  updateStatsDisplay(defaultTime.toString());
  statsModal.classList.remove("hidden");
});

closeStatsButton.addEventListener("click", () => {
  statsModal.classList.add("hidden");
});

// Update stats display
function updateStatsDisplay(selectedTime = "30") {
  // Hide all stats content containers
  document.querySelectorAll(".stats-content").forEach((container) => {
    container.classList.add("hidden");
  });

  // Update tab styling
  document.querySelectorAll(".stats-tab").forEach((tab) => {
    if (tab.dataset.time === selectedTime) {
      tab.classList.add("text-blue-600", "border-blue-600");
      tab.classList.remove("text-gray-600", "border-transparent");
    } else {
      tab.classList.remove("text-blue-600", "border-blue-600");
      tab.classList.add("text-gray-600", "border-transparent");
    }
  });

  // Get the container for the selected time period
  const statsContent = document.getElementById(`stats-content-${selectedTime}`);
  if (!statsContent) {
    console.error(`Stats container for ${selectedTime}s not found`);
    return;
  }

  // Get stats for selected time
  const timeStats = stats.timeStats[selectedTime] || {
    gamesPlayed: 0,
    bestScore: 0,
    totalWords: 0,
  };

  // Clear the current content
  statsContent.innerHTML = "";

  if (!timeStats || timeStats.gamesPlayed === 0) {
    // Show message for no games played
    statsContent.innerHTML = `
      <div class="col-span-2 text-center py-8 text-gray-500">
        <p class="text-lg">No games played with ${formatTime(
          parseInt(selectedTime)
        )} timer yet.</p>
        <p class="mt-2">Play a game to see your stats!</p>
      </div>
    `;
  } else {
    // Games Played
    statsContent.appendChild(
      createStatBox("Games Played", timeStats.gamesPlayed)
    );

    // Best Score
    statsContent.appendChild(createStatBox("Best Score", timeStats.bestScore));

    // Total Words
    statsContent.appendChild(
      createStatBox("Total Words", timeStats.totalWords)
    );

    // Average Score
    const avgScore =
      Math.round((timeStats.totalWords / timeStats.gamesPlayed) * 10) / 10;
    statsContent.appendChild(createStatBox("Average Score", avgScore));
  }

  // Show the container
  statsContent.classList.remove("hidden");
}

// Helper function to create stat box
function createStatBox(label, value) {
  const div = document.createElement("div");
  div.className =
    "bg-gray-50 dark:bg-gray-700 rounded-xl p-5 transition transform hover:scale-105";
  div.innerHTML = `
    <h3 class="text-gray-600 dark:text-gray-300 text-sm mb-3">${label}</h3>
    <p class="text-4xl font-bold text-gray-800 dark:text-gray-100">${value}</p>
  `;
  return div;
}

// Helper function to format time
function formatTime(seconds) {
  if (seconds < 60) return `${seconds} seconds`;
  return seconds === 60 ? "1 minute" : `${seconds / 60} minutes`;
}

// Event listeners
startRoundButton.addEventListener("click", () => {
  const gameControls = document.querySelector(".game-controls");
  if (gameControls) {
    gameControls.classList.add("hidden");
  }
  startRoundButton.disabled = true;
  wordInput.disabled = true;
  submitButton.disabled = true;

  // Apply the get-ready-text class to the hint
  wordHint.textContent = "Get ready...";
  wordHint.classList.add("get-ready-text");

  // Show traffic light
  const trafficLight = document.getElementById("traffic-light");
  trafficLight.classList.remove("hidden");

  // Get light elements
  const redLight = trafficLight.querySelector(".red");
  const yellowLight = trafficLight.querySelector(".yellow");
  const greenLight = trafficLight.querySelector(".green");

  // Reset all lights
  redLight.classList.remove("active");
  yellowLight.classList.remove("active");
  greenLight.classList.remove("active");

  // Start countdown sequence with slower timing
  setTimeout(() => {
    redLight.classList.add("active");
    setTimeout(() => {
      redLight.classList.remove("active");
      yellowLight.classList.add("active");
      setTimeout(() => {
        yellowLight.classList.remove("active");
        greenLight.classList.add("active");
        setTimeout(() => {
          // Hide traffic light and start game
          trafficLight.classList.add("hidden");
          greenLight.classList.remove("active");

          // Show the current letter and start the game
          currentLetterDisplay.classList.remove("hidden");
          wordInput.disabled = false;
          submitButton.disabled = false;

          // Remove the get-ready-text class and set the normal hint
          wordHint.classList.remove("get-ready-text");
          wordHint.textContent = `Start your word with '${currentLetter}'!`;
          wordHint.className =
            "text-xl text-gray-600 dark:text-gray-300 font-medium mb-4 sm:mb-6 text-center";

          startTimer();
          wordInput.focus();
        }, 1000); // Green light duration - increased from 500ms to 1000ms
      }, 1000); // Yellow light duration - increased from 500ms to 1000ms
    }, 1000); // Red light duration - increased from 500ms to 1000ms
  }, 300); // Initial delay before starting the sequence - increased from 0ms to 300ms
});

// Event listeners
timeSelect.addEventListener("change", () => {
  defaultTime = parseInt(timeSelect.value, 10);
  timeLeft = defaultTime;
  timeDisplay.textContent = `${timeLeft}s`;

  // Don't call updateDisplay() which would reveal the letter
  // Just update the time display, but keep the hint text as is

  // Update game description to reflect selected time
  const gameDescription = document.querySelector(
    ".game-description p:nth-child(4)"
  );
  if (gameDescription) {
    gameDescription.textContent = `You have ${defaultTime} seconds to make as many valid words as possible!`;
  }
});

// Start the game
initGame();

// Add this to ensure controls are visible on initial load
document.addEventListener("DOMContentLoaded", () => {
  if (gameControls) {
    gameControls.classList.remove("hidden");
  }
});

// Add event listeners for stat tabs
document.querySelectorAll(".stats-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    updateStatsDisplay(tab.dataset.time);
  });
});
