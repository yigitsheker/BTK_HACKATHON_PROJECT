// Modern Grammar Typer JavaScript
const sentencePools = {
  "A1-A2": [
    { tr: "Ben öğrenciyim.", en: "I am a student" },
    { tr: "Bu bir elma.", en: "This is an apple" },
    { tr: "O mutlu.", en: "He is happy" },
    { tr: "Biz evdeyiz.", en: "We are at home" },
    { tr: "Köpek koşuyor.", en: "The dog is running" },
  ],
  "B1-B2": [
    { tr: "Ben bu kitabı daha önce okudum.", en: "I have read this book before" },
    { tr: "Yarın toplantıya katılacağım.", en: "I will attend the meeting tomorrow" },
    { tr: "Onlar hiç İstanbul'u ziyaret etmedi.", en: "They have never visited Istanbul" },
    { tr: "Araba tamir ediliyor.", en: "The car is being repaired" },
    { tr: "Film oldukça ilginçti.", en: "The movie was quite interesting" },
  ],
  "C1-C2": [
    { tr: "Eğer zamanım olsaydı, sana yardım ederdim.", en: "If I had time, I would help you" },
    { tr: "Projeyi zamanında tamamlamış olmalı.", en: "He must have completed the project on time" },
    { tr: "Sorular genellikle öğrencilere sorulur.", en: "The questions are usually asked to students" },
    { tr: "O konuşmayı yapmadan önce çok hazırlandı.", en: "She prepared a lot before giving the speech" },
    { tr: "Hiç böyle karmaşık bir problem çözmedim.", en: "I have never solved such a complex problem" },
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
  time: 0,
  maxTime: 10,
  userAnswers: [],
  totalQuestions: 5,
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

const turkishSentence = document.getElementById("turkishSentence")
const userInput = document.getElementById("userInput")
const submitBtn = document.getElementById("submitAnswer")
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

function getTimeForLevel(level) {
  if (level === "A1-A2") return 10
  if (level === "B1-B2") return 15
  if (level === "C1-C2") return 20
  return 10
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
  const progress = (gameState.time / gameState.maxTime) * 283
  const offset = 283 - progress
  timerCircle.style.strokeDashoffset = offset
}

// Game Functions
function startGame() {
  const selectedLevel = document.querySelector('input[name="level"]:checked').value
  gameState.level = selectedLevel
  gameState.sentences = shuffleArray(sentencePools[selectedLevel]).slice(0, gameState.totalQuestions)
  gameState.currentIndex = 0
  gameState.score = 0
  gameState.correctCount = 0
  gameState.wrongCount = 0
  gameState.userAnswers = []
  gameState.maxTime = getTimeForLevel(selectedLevel)

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
  turkishSentence.textContent = current.tr
  updateProgress()

  gameState.time = gameState.maxTime
  updateStats()
  updateTimer()

  userInput.value = ""
  userInput.focus()
  feedback.textContent = ""
  feedback.className = "feedback-message"

  clearInterval(gameState.timer)
  gameState.timer = setInterval(() => {
    gameState.time--
    updateStats()
    updateTimer()

    if (gameState.time <= 0) {
      clearInterval(gameState.timer)
      handleSubmit(null)
    }
  }, 1000)
}

function handleSubmit(inputValue) {
  clearInterval(gameState.timer)

  const current = gameState.sentences[gameState.currentIndex]
  const userVal = normalize(inputValue || userInput.value)
  const correctVal = normalize(current.en)
  const original = current.en

  let isCorrect = false
  if (userVal && userVal === correctVal) {
    isCorrect = true
    feedback.innerHTML = "✅ Correct!"
    feedback.className = "feedback-message correct"
    gameState.score += 10
    gameState.correctCount++
  } else {
    feedback.innerHTML = `❌ Wrong or empty.<br>✅ Correct: <strong>${original}</strong>`
    feedback.className = "feedback-message wrong"
    gameState.wrongCount++
  }

  gameState.userAnswers.push({
    turkish: current.tr,
    correct: original,
    user: userVal || null,
    isCorrect: isCorrect,
  })

  updateStats()
  gameState.currentIndex++

  setTimeout(() => {
    feedback.textContent = ""
    nextSentence()
  }, 1500)
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
        🎉 Perfect! All translations correct!
      </div>
    `
    return
  }

  let html = "<h3>Review Mistakes:</h3><ul>"
  mistakes.forEach((mistake) => {
    html += `
      <li>
        <div><strong>Turkish:</strong> ${mistake.turkish}</div>
        <div><strong>Your answer:</strong> <span style="color: var(--error-color);">${mistake.user || "No answer"}</span></div>
        <div><strong>Correct answer:</strong> <span style="color: var(--success-color);">${mistake.correct}</span></div>
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
}

// Event Listeners
startGameBtn.addEventListener("click", startGame)
playAgainBtn.addEventListener("click", resetGame)
submitBtn.addEventListener("click", () => handleSubmit())

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSubmit()
  }
})

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  resetGame()
})
