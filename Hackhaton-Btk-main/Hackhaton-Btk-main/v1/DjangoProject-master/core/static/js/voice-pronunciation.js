// Modern Voice Pronunciation JavaScript
const sentencePools = {
  "A1-A2": [
    { tr: "Ben her sabah kahve içerim.", en: "I drink coffee every morning" },
    { tr: "O bir öğretmen.", en: "She is a teacher" },
    { tr: "Bu bir kalem.", en: "This is a pen" },
    { tr: "Masada bir kitap var.", en: "There is a book on the table" },
    { tr: "Onlar okulda.", en: "They are at school" },
  ],
  "B1-B2": [
    { tr: "Ben bu filmi daha önce izledim.", en: "I have seen this movie before" },
    { tr: "Dün sinemaya gittik.", en: "We went to the cinema yesterday" },
    { tr: "O İngilizce konuşabilir.", en: "He can speak English" },
    { tr: "O kitabı henüz bitirmedi.", en: "She hasn't finished the book yet" },
    { tr: "Bu odaya girmemelisin.", en: "You must not enter this room" },
  ],
  "C1-C2": [
    { tr: "Daha fazla çalışsaydım, sınavı geçerdim.", en: "If I had studied more, I would have passed the exam" },
    { tr: "Toplantı ertelendi.", en: "The meeting was postponed" },
    { tr: "O kitabı yazan adam İngilizmiş.", en: "The man who wrote that book was English" },
    { tr: "İşini zamanında bitirmiş olmalı.", en: "He must have finished his work on time" },
    { tr: "Bu sorular genellikle öğrenciler tarafından sorulur.", en: "These questions are often asked by students" },
  ],
}

const gameState = {
  level: null,
  sentences: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  wrongCount: 0,
  timer: null,
  time: 10,
  userAnswers: [],
  totalQuestions: 5,
  isListening: false,
}

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
let recognition = null

if (SpeechRecognition) {
  recognition = new SpeechRecognition()
  recognition.lang = "en-US"
  recognition.interimResults = false
  recognition.maxAlternatives = 1
}

// DOM Elements
const levelSelect = document.getElementById("levelSelect")
const gameSection = document.getElementById("gameSection")
const gameOver = document.getElementById("gameOver")
const startGameBtn = document.getElementById("startGame")
const playAgainBtn = document.getElementById("playAgain")

const progressFill = document.getElementById("progressFill")
const questionNum = document.getElementById("questionNum")
const totalQuestions = document.getElementById("totalQuestions")
const scoreSpan = document.getElementById("score")
const timeSpan = document.getElementById("time")
const timerCircle = document.getElementById("timerCircle")

const turkish = document.getElementById("turkish")
const expectedSentence = document.getElementById("expectedSentence")
const startBtn = document.getElementById("startBtn")
const voiceAnimation = document.getElementById("voiceAnimation")
const feedback = document.getElementById("feedback")

const finalScore = document.getElementById("finalScore")
const correctBar = document.getElementById("correctBar")
const wrongBar = document.getElementById("wrongBar")
const correctCount = document.getElementById("correctCount")
const wrongCount = document.getElementById("wrongCount")
const mistakeSummary = document.getElementById("mistakeSummary")

// Utility Functions
function shuffleArray(arr) {
  const newArr = [...arr]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?']/g, "")
    .trim()
}

function updateProgress() {
  const progress = ((gameState.currentIndex + 1) / gameState.totalQuestions) * 100
  progressFill.style.width = `${progress}%`
  questionNum.textContent = gameState.currentIndex + 1
}

function updateStats() {
  scoreSpan.textContent = gameState.score
  timeSpan.textContent = gameState.time
}

function updateTimer() {
  const progress = (gameState.time / 10) * 283
  const offset = 283 - progress
  timerCircle.style.strokeDashoffset = offset
}

// Game Functions
function startGame() {
  if (!recognition) {
    alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.")
    return
  }

  const selectedLevel = document.querySelector('input[name="level"]:checked').value
  gameState.level = selectedLevel
  gameState.sentences = shuffleArray(sentencePools[selectedLevel]).slice(0, gameState.totalQuestions)
  gameState.currentIndex = 0
  gameState.score = 0
  gameState.correctCount = 0
  gameState.wrongCount = 0
  gameState.userAnswers = []

  levelSelect.style.display = "none"
  gameSection.style.display = "block"
  gameOver.style.display = "none"

  totalQuestions.textContent = gameState.totalQuestions

  nextSentence()
}

function nextSentence() {
  if (gameState.currentIndex >= gameState.sentences.length) {
    endGame()
    return
  }

  const current = gameState.sentences[gameState.currentIndex]
  turkish.textContent = current.tr
  expectedSentence.textContent = `Expected: "${current.en}"`
  updateProgress()

  gameState.time = 10
  updateStats()
  updateTimer()

  feedback.textContent = ""
  feedback.className = "feedback-message"
  startBtn.disabled = false
  startBtn.querySelector(".button-text").textContent = "Start Speaking"
  startBtn.classList.remove("listening")

  clearInterval(gameState.timer)
  gameState.timer = setInterval(() => {
    gameState.time--
    updateStats()
    updateTimer()

    if (gameState.time <= 0) {
      clearInterval(gameState.timer)
      if (gameState.isListening) {
        recognition.stop()
      }
      handleResult(null)
    }
  }, 1000)
}

function startListening() {
  if (!recognition || gameState.isListening) return

  gameState.isListening = true
  startBtn.classList.add("listening")
  startBtn.querySelector(".button-text").textContent = "Listening..."
  startBtn.disabled = true

  feedback.textContent = "🎤 Listening..."
  feedback.className = "feedback-message listening"

  recognition.start()
}

function handleResult(spokenText) {
  gameState.isListening = false
  startBtn.classList.remove("listening")
  startBtn.disabled = true
  clearInterval(gameState.timer)

  const current = gameState.sentences[gameState.currentIndex]
  const spoken = spokenText ? normalize(spokenText) : null
  const expected = normalize(current.en)
  const original = current.en

  let isCorrect = false
  if (spoken && (spoken.includes(expected) || expected.includes(spoken) || spoken === expected)) {
    isCorrect = true
    feedback.innerHTML = "✅ Perfect pronunciation!"
    feedback.className = "feedback-message correct"
    gameState.score += 10
    gameState.correctCount++
  } else {
    feedback.innerHTML = `❌ ${spoken ? `You said: "${spokenText}"` : "No speech detected"}<br>✅ Correct: <strong>${original}</strong>`
    feedback.className = "feedback-message wrong"
    gameState.wrongCount++
  }

  gameState.userAnswers.push({
    turkish: current.tr,
    correct: original,
    user: spokenText || null,
    isCorrect: isCorrect,
  })

  updateStats()
  gameState.currentIndex++

  setTimeout(() => {
    feedback.textContent = ""
    nextSentence()
  }, 2000)
}

function endGame() {
  clearInterval(gameState.timer)

  gameSection.style.display = "none"
  gameOver.style.display = "block"

  // Update final score
  const accuracy = Math.round((gameState.correctCount / gameState.totalQuestions) * 100)
  finalScore.innerHTML = `
    <div>Score: <strong>${gameState.score}</strong> / ${gameState.totalQuestions * 10}</div>
    <div>Accuracy: <strong>${accuracy}%</strong></div>
    <div>Correct: <strong>${gameState.correctCount}</strong> / Wrong: <strong>${gameState.wrongCount}</strong></div>
  `

  // Update performance chart
  const correctPercentage = (gameState.correctCount / gameState.totalQuestions) * 100
  const wrongPercentage = (gameState.wrongCount / gameState.totalQuestions) * 100

  setTimeout(() => {
    correctBar.style.height = `${correctPercentage}%`
    wrongBar.style.height = `${wrongPercentage}%`
  }, 500)

  correctCount.textContent = gameState.correctCount
  wrongCount.textContent = gameState.wrongCount

  // Show mistake summary
  showMistakeSummary()
}

function showMistakeSummary() {
  const mistakes = gameState.userAnswers.filter((answer) => !answer.isCorrect)

  if (mistakes.length === 0) {
    mistakeSummary.innerHTML = `
      <div style="text-align: center; color: var(--success-color); font-weight: 600;">
        🎉 Perfect! All pronunciations correct!
      </div>
    `
    return
  }

  let html = "<h3>Review Mistakes:</h3><ul>"
  mistakes.forEach((mistake) => {
    html += `
      <li>
        <div><strong>Turkish:</strong> ${mistake.turkish}</div>
        <div><strong>Your pronunciation:</strong> <span style="color: var(--error-color);">${mistake.user || "No speech detected"}</span></div>
        <div><strong>Correct sentence:</strong> <span style="color: var(--success-color);">${mistake.correct}</span></div>
      </li>
    `
  })
  html += "</ul>"

  mistakeSummary.innerHTML = html
}

function resetGame() {
  levelSelect.style.display = "block"
  gameSection.style.display = "none"
  gameOver.style.display = "none"

  // Reset progress bar
  progressFill.style.width = "20%"

  // Reset chart bars
  correctBar.style.height = "0%"
  wrongBar.style.height = "0%"

  // Reset timer circle
  timerCircle.style.strokeDashoffset = "283"

  clearInterval(gameState.timer)
  gameState.isListening = false

  if (recognition) {
    recognition.stop()
  }
}

// Speech Recognition Event Listeners
if (recognition) {
  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript
    handleResult(spokenText)
  }

  recognition.onerror = (event) => {
    gameState.isListening = false
    startBtn.classList.remove("listening")
    startBtn.disabled = false
    startBtn.querySelector(".button-text").textContent = "Start Speaking"

    feedback.innerHTML = `⚠️ Error: ${event.error}. Please try again.`
    feedback.className = "feedback-message wrong"
  }

  recognition.onend = () => {
    if (gameState.isListening) {
      gameState.isListening = false
      startBtn.classList.remove("listening")
      startBtn.disabled = false
      startBtn.querySelector(".button-text").textContent = "Start Speaking"
    }
  }
}

// Event Listeners
startGameBtn.addEventListener("click", startGame)
playAgainBtn.addEventListener("click", resetGame)
startBtn.addEventListener("click", startListening)

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  resetGame()
})
