let trials = 0;
let correct = 0;
let mistakes = 0;
let sumRT = 0;
let startTime = 0;
let currentStimulus = "";
let gameStarted = false;

const MAX_TRIALS = 10;
const MAX_MISTAKES = 3;

let stimulusEl, trialsEl, correctEl, mistakesEl, avgEl, feedbackEl;

function initializeElements() {
  stimulusEl = document.getElementById("stimulus");
  trialsEl = document.getElementById("trials");
  correctEl = document.getElementById("correct");
  mistakesEl = document.getElementById("mistakes");
  avgEl = document.getElementById("avg");
  feedbackEl = document.getElementById("feedback");
}

function getRandomStimulus() {
  // 50% chance of letter and number using ascii characters
  return Math.random() < 0.5
    ? String.fromCharCode(65 + Math.floor(Math.random() * 26))
    : Math.floor(Math.random() * 10).toString();
}

function startTrial() {
  if (trials >= MAX_TRIALS || mistakes >= MAX_MISTAKES) return;
  currentStimulus = getRandomStimulus();
  stimulusEl.textContent = currentStimulus;
  startTime = performance.now();
}

function handleResponse(isCorrect) {
  //time calculation
  const rt = Math.round(performance.now() - startTime);
  sumRT += rt;
  trials++;

  if (isCorrect) correct++;
  else mistakes++;

  const avg = trials >= 3 ? Math.round(sumRT / trials) : "—";

  trialsEl.textContent = trials;
  correctEl.textContent = correct;
  mistakesEl.textContent = mistakes;
  avgEl.textContent = avg;

  feedbackEl.innerHTML = isCorrect
    ? `<span style="color:#00ffaa">✅ ${rt} ms</span>`
    : `<span style="color:#ff3366">❌ Wrong • ${rt} ms</span>`;

  if (mistakes >= MAX_MISTAKES) {
    setTimeout(gameOverFail, 700);
  } else if (trials >= MAX_TRIALS) {
    setTimeout(gameOverSuccess, 700);
  } else {
    setTimeout(startTrial, 900);
  }
}

function gameOverSuccess() {
  const finalAvg = Math.round(sumRT / trials);
  stimulusEl.innerHTML = `<div style="font-size:60px;color:#00ffaa">🎉 SUCCESS!<br>Avg RT: ${finalAvg} ms</div>`;
}

function gameOverFail() {
  stimulusEl.innerHTML = `<div style="font-size:60px;color:#ff3366">💥 GAME OVER<br>3 mistakes reached</div>`;
}

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  stimulusEl.style.background = "#ffffff";
  startTrial();
}

function setupEventListeners() {
  document.getElementById("btnA").addEventListener("click", () => {
    if (!gameStarted) return;
    handleResponse(!isNaN(parseInt(currentStimulus)) ? false : true);
  });

  document.getElementById("btnL").addEventListener("click", () => {
    if (!gameStarted) return;
    handleResponse(isNaN(parseInt(currentStimulus)) ? false : true);
  });

  document.getElementById("btnSpace").addEventListener("click", () => {
    if (!gameStarted) startGame();
    else startTrial();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === " " && !gameStarted) {
      e.preventDefault();
      startGame();
    } else if (gameStarted) {
      if (e.key.toUpperCase() === "A")
        handleResponse(!isNaN(parseInt(currentStimulus)) ? false : true);
      if (e.key.toUpperCase() === "L")
        handleResponse(isNaN(parseInt(currentStimulus)) ? false : true);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initializeElements();
    setupEventListeners();
    stimulusEl.textContent = "SPACE\nto\nStart";
  });
} else {
  // DOM is already loaded
  initializeElements();
  setupEventListeners();
  stimulusEl.textContent = "SPACE\nto\nStart";
}
