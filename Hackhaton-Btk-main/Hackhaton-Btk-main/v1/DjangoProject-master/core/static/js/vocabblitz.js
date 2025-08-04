// Enhanced VocabBlitz - Bilingual Word Match Game

document.addEventListener("DOMContentLoaded", () => {
  // DOM referansları
  const levelSelect = document.getElementById("levelSelect")
  const gameSection = document.getElementById("gameSection")
  const wordDisplay = document.getElementById("wordDisplay")
  const scoreSpan = document.getElementById("score")
  const questionNumSpan = document.getElementById("questionNum")
  const timeSpan = document.getElementById("time")
  const message = document.getElementById("message")
  const gameOver = document.getElementById("gameOver")
  const finalScore = document.getElementById("finalScore")
  const playAgain = document.getElementById("playAgain")
  const startGameBtn = document.getElementById("startGame")
  const choicesDiv = document.getElementById("choices")
  const progressFill = document.getElementById("progressFill")
  const timerCircle = document.getElementById("timerCircle")
  const resultIcon = document.getElementById("resultIcon")
  const resultTitle = document.getElementById("resultTitle")
  const correctBar = document.getElementById("correctBar")
  const wrongBar = document.getElementById("wrongBar")
  const correctCount = document.getElementById("correctCount")
  const wrongCount = document.getElementById("wrongCount")

  const wordPools = {
    "A1-A2": [
      { en: "cat", tr: "kedi", pronunciation: "/kæt/" },
      { en: "dog", tr: "köpek", pronunciation: "/dɔːɡ/" },
      { en: "house", tr: "ev", pronunciation: "/haʊs/" },
      { en: "book", tr: "kitap", pronunciation: "/bʊk/" },
      { en: "car", tr: "araba", pronunciation: "/kɑːr/" },
      { en: "water", tr: "su", pronunciation: "/ˈwɔːtər/" },
      { en: "apple", tr: "elma", pronunciation: "/ˈæpəl/" },
      { en: "school", tr: "okul", pronunciation: "/skuːl/" },
      { en: "sun", tr: "güneş", pronunciation: "/sʌn/" },
      { en: "table", tr: "masa", pronunciation: "/ˈteɪbəl/" },
      { en: "chair", tr: "sandalye", pronunciation: "/tʃer/" },
      { en: "pen", tr: "kalem", pronunciation: "/pen/" },
      { en: "window", tr: "pencere", pronunciation: "/ˈwɪndoʊ/" },
      { en: "door", tr: "kapı", pronunciation: "/dɔːr/" },
      { en: "milk", tr: "süt", pronunciation: "/mɪlk/" },
      { en: "bread", tr: "ekmek", pronunciation: "/bred/" },
      { en: "tree", tr: "ağaç", pronunciation: "/triː/" },
      { en: "bird", tr: "kuş", pronunciation: "/bɜːrd/" },
      { en: "fish", tr: "balık", pronunciation: "/fɪʃ/" },
      { en: "flower", tr: "çiçek", pronunciation: "/ˈflaʊər/" },
    ],
    "B1-B2": [
      { en: "challenge", tr: "meydan okuma", pronunciation: "/ˈtʃælɪndʒ/" },
      { en: "improve", tr: "geliştirmek", pronunciation: "/ɪmˈpruːv/" },
      { en: "solution", tr: "çözüm", pronunciation: "/səˈluːʃən/" },
      { en: "opinion", tr: "görüş", pronunciation: "/əˈpɪnjən/" },
      { en: "environment", tr: "çevre", pronunciation: "/ɪnˈvaɪrənmənt/" },
      { en: "opportunity", tr: "fırsat", pronunciation: "/ˌɑːpərˈtuːnəti/" },
      { en: "responsible", tr: "sorumlu", pronunciation: "/rɪˈspɑːnsəbəl/" },
      { en: "experience", tr: "deneyim", pronunciation: "/ɪkˈspɪriəns/" },
      { en: "decision", tr: "karar", pronunciation: "/dɪˈsɪʒən/" },
      { en: "support", tr: "destek", pronunciation: "/səˈpɔːrt/" },
      { en: "community", tr: "topluluk", pronunciation: "/kəˈmjuːnəti/" },
      { en: "increase", tr: "artırmak", pronunciation: "/ɪnˈkriːs/" },
      { en: "reduce", tr: "azaltmak", pronunciation: "/rɪˈduːs/" },
      { en: "require", tr: "gerektirmek", pronunciation: "/rɪˈkwaɪər/" },
      { en: "suggestion", tr: "öneri", pronunciation: "/səˈdʒestʃən/" },
      { en: "achievement", tr: "başarı", pronunciation: "/əˈtʃiːvmənt/" },
      { en: "attend", tr: "katılmak", pronunciation: "/əˈtend/" },
      { en: "compare", tr: "karşılaştırmak", pronunciation: "/kəmˈper/" },
      { en: "describe", tr: "tanımlamak", pronunciation: "/dɪˈskraɪb/" },
      { en: "prepare", tr: "hazırlamak", pronunciation: "/prɪˈper/" },
    ],
    "C1-C2": [
      { en: "comprehensive", tr: "kapsamlı", pronunciation: "/ˌkɑːmprɪˈhensɪv/" },
      { en: "notwithstanding", tr: "-e rağmen", pronunciation: "/ˌnɑːtwɪθˈstændɪŋ/" },
      { en: "subsequently", tr: "sonradan", pronunciation: "/ˈsʌbsɪkwəntli/" },
      { en: "predominantly", tr: "çoğunlukla", pronunciation: "/prɪˈdɑːmɪnəntli/" },
      { en: "contemplate", tr: "düşünüp taşınmak", pronunciation: "/ˈkɑːntəmpleɪt/" },
      { en: "perceive", tr: "algılamak", pronunciation: "/pərˈsiːv/" },
      { en: "convey", tr: "iletmek", pronunciation: "/kənˈveɪ/" },
      { en: "detrimental", tr: "zararlı", pronunciation: "/ˌdetrɪˈmentəl/" },
      { en: "inadvertently", tr: "yanlışlıkla", pronunciation: "/ˌɪnədˈvɜːrtəntli/" },
      { en: "meticulous", tr: "titiz", pronunciation: "/məˈtɪkjələs/" },
      { en: "notion", tr: "kavram", pronunciation: "/ˈnoʊʃən/" },
      { en: "prevalent", tr: "yaygın", pronunciation: "/ˈprevələnt/" },
      { en: "scrutiny", tr: "inceleme", pronunciation: "/ˈskruːtəni/" },
      { en: "substantiate", tr: "kanıtlamak", pronunciation: "/səbˈstænʃieɪt/" },
      { en: "ubiquitous", tr: "her yerde bulunan", pronunciation: "/juːˈbɪkwɪtəs/" },
      { en: "vindicate", tr: "aklamak", pronunciation: "/ˈvɪndɪkeɪt/" },
      { en: "alleviate", tr: "hafifletmek", pronunciation: "/əˈliːvieɪt/" },
      { en: "conspicuous", tr: "göze çarpan", pronunciation: "/kənˈspɪkjuəs/" },
      { en: "elaborate", tr: "ayrıntılı", pronunciation: "/ɪˈlæbərət/" },
      { en: "facetious", tr: "nükteli", pronunciation: "/fəˈsiːʃəs/" },
    ],
  }

  let currentLevel = null
  let currentWords = []
  let score = 0
  let questionNum = 1
  const totalQuestions = 10
  let time = 0
  let maxTime = 0
  let timer = null
  let currentWord = null
  let choices = []
  let canAnswer = true
  let correctAnswers = 0
  let wrongAnswers = 0
  let userAnswers = []

  // Utility functions
  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5)
  }

  function getTimeForLevel(level) {
    if (level === "A1-A2") return 7
    if (level === "B1-B2") return 5
    if (level === "C1-C2") return 4
    return 5
  }

  function updateProgress() {
    const progress = ((questionNum - 1) / totalQuestions) * 100
    progressFill.style.width = `${progress}%`
  }

  function updateTimer() {
    const progress = time / maxTime
    const circumference = 2 * Math.PI * 45
    const offset = circumference * (1 - progress)
    timerCircle.style.strokeDashoffset = offset
  }

  function createParticleEffect(element, type) {
    const rect = element.getBoundingClientRect()
    const particles = document.createElement("div")
    particles.className = "particle-explosion"
    particles.style.position = "fixed"
    particles.style.left = rect.left + rect.width / 2 + "px"
    particles.style.top = rect.top + rect.height / 2 + "px"
    particles.style.pointerEvents = "none"
    particles.style.zIndex = "1000"

    const colors = type === "correct" ? ["#10b981", "#34d399", "#6ee7b7"] : ["#ef4444", "#f87171", "#fca5a5"]

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div")
      particle.style.position = "absolute"
      particle.style.width = "6px"
      particle.style.height = "6px"
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      particle.style.borderRadius = "50%"
      particle.style.animation = `particle-burst 0.6s ease-out forwards`
      particle.style.animationDelay = Math.random() * 0.1 + "s"

      const angle = (i / 12) * Math.PI * 2
      const distance = 50 + Math.random() * 30
      particle.style.setProperty("--dx", Math.cos(angle) * distance + "px")
      particle.style.setProperty("--dy", Math.sin(angle) * distance + "px")

      particles.appendChild(particle)
    }

    document.body.appendChild(particles)
    setTimeout(() => particles.remove(), 600)
  }

  // Add particle animation CSS
  const style = document.createElement("style")
  style.textContent = `
    @keyframes particle-burst {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
      100% {
        transform: translate(var(--dx), var(--dy)) scale(0);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)

  function startGame(level) {
    currentLevel = level
    currentWords = shuffle([...wordPools[level]]).slice(0, totalQuestions)
    score = 0
    questionNum = 1
    correctAnswers = 0
    wrongAnswers = 0
    userAnswers = []

    // Show game section with animation
    levelSelect.style.display = "none"
    gameSection.style.display = "block"
    gameOver.style.display = "none"

    // Reset UI
    scoreSpan.textContent = score
    questionNumSpan.textContent = questionNum
    document.getElementById("totalQuestions").textContent = totalQuestions
    message.textContent = ""
    message.className = "feedback-message"

    updateProgress()
    nextQuestion()
  }

  function nextQuestion() {
    canAnswer = true
    message.textContent = ""
    message.className = "feedback-message"

    if (questionNum > totalQuestions) {
      endGame()
      return
    }

    currentWord = currentWords[questionNum - 1]
    wordDisplay.textContent = currentWord.en

    // Show pronunciation if available
    const pronunciationDiv = document.getElementById("wordPronunciation")
    if (pronunciationDiv && currentWord.pronunciation) {
      pronunciationDiv.textContent = currentWord.pronunciation
    }

    // Create choices
    const wrongChoices = shuffle(wordPools[currentLevel].filter((w) => w.tr !== currentWord.tr)).slice(0, 3)
    choices = shuffle([
      { text: currentWord.tr, correct: true },
      ...wrongChoices.map((w) => ({ text: w.tr, correct: false })),
    ])

    renderChoices()
    startTimer()
    updateProgress()
  }

  function renderChoices() {
    choicesDiv.innerHTML = ""
    choices.forEach((choice, idx) => {
      const btn = document.createElement("button")
      btn.className = "choice-btn"
      btn.textContent = choice.text
      btn.onclick = () => selectChoice(idx, btn)
      btn.disabled = !canAnswer
      choicesDiv.appendChild(btn)
    })
  }

  function startTimer() {
    maxTime = getTimeForLevel(currentLevel)
    time = maxTime
    timeSpan.textContent = time
    updateTimer()

    clearInterval(timer)
    timer = setInterval(() => {
      time--
      timeSpan.textContent = time
      updateTimer()

      if (time <= 0) {
        clearInterval(timer)
        if (canAnswer) {
          handleTimeout()
        }
      }
    }, 1000)
  }

  function selectChoice(idx, buttonElement) {
    if (!canAnswer) return

    canAnswer = false
    clearInterval(timer)

    const isCorrect = choices[idx].correct
    const selectedChoice = choices[idx].text

    // Record answer
    userAnswers.push({
      word: currentWord.en,
      correct: currentWord.tr,
      selected: selectedChoice,
      isCorrect: isCorrect,
    })

    // Update score and counters
    if (isCorrect) {
      score++
      correctAnswers++
      message.textContent = "Correct! Well done!"
      message.className = "feedback-message correct"
      createParticleEffect(buttonElement, "correct")
    } else {
      wrongAnswers++
      message.textContent = `Wrong! The correct answer is: ${currentWord.tr}`
      message.className = "feedback-message wrong"
      createParticleEffect(buttonElement, "wrong")
    }

    // Update UI
    scoreSpan.textContent = score

    // Color the buttons
    Array.from(choicesDiv.children).forEach((btn, i) => {
      btn.disabled = true
      if (choices[i].correct) {
        btn.classList.add("correct")
      } else if (i === idx && !choices[i].correct) {
        btn.classList.add("wrong")
      }
    })

    // Move to next question
    setTimeout(() => {
      questionNum++
      questionNumSpan.textContent = Math.min(questionNum, totalQuestions)
      nextQuestion()
    }, 1500)
  }

  function handleTimeout() {
    canAnswer = false
    wrongAnswers++

    userAnswers.push({
      word: currentWord.en,
      correct: currentWord.tr,
      selected: null,
      isCorrect: false,
    })

    message.textContent = `Time's up! The correct answer was: ${currentWord.tr}`
    message.className = "feedback-message wrong"

    // Highlight correct answer
    Array.from(choicesDiv.children).forEach((btn, i) => {
      btn.disabled = true
      if (choices[i].correct) {
        btn.classList.add("correct")
      }
    })

    setTimeout(() => {
      questionNum++
      questionNumSpan.textContent = Math.min(questionNum, totalQuestions)
      nextQuestion()
    }, 1500)
  }

  function endGame() {
    clearInterval(timer)
    gameSection.style.display = "none"
    gameOver.style.display = "block"

    // Calculate performance
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100)

    // Update result display
    if (accuracy >= 80) {
      resultIcon.innerHTML = '<span class="material-icons">emoji_events</span>'
      resultIcon.style.background = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
      resultTitle.textContent = "Excellent Work!"
    } else if (accuracy >= 60) {
      resultIcon.innerHTML = '<span class="material-icons">thumb_up</span>'
      resultIcon.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      resultTitle.textContent = "Good Job!"
    } else {
      resultIcon.innerHTML = '<span class="material-icons">school</span>'
      resultIcon.style.background = "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
      resultTitle.textContent = "Keep Practicing!"
    }

    finalScore.innerHTML = `
      <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color); margin-bottom: 0.5rem;">
        ${accuracy}% Accuracy
      </div>
      <div>Score: <strong>${score}</strong> out of <strong>${totalQuestions}</strong></div>
    `

    // Update counters
    correctCount.textContent = correctAnswers
    wrongCount.textContent = wrongAnswers

    // Animate performance bars
    setTimeout(() => {
      const correctHeight = (correctAnswers / totalQuestions) * 100
      const wrongHeight = (wrongAnswers / totalQuestions) * 100
      correctBar.style.height = `${correctHeight}%`
      wrongBar.style.height = `${wrongHeight}%`
    }, 500)

    // Show wrong answers summary
    renderWrongSummary()

    // Suggest next level if performance is good
    if (accuracy >= 70) {
      let nextLevel = null
      if (currentLevel === "A1-A2") nextLevel = "B1-B2"
      else if (currentLevel === "B1-B2") nextLevel = "C1-C2"

      if (nextLevel) {
        finalScore.innerHTML += `
          <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-lg); border-left: 4px solid var(--success-color);">
            <strong>🎉 Ready for the next level!</strong><br>
            <button id="nextLevelBtn" class="primary-button" style="margin-top: 0.5rem;">
              Try ${nextLevel} Level
            </button>
          </div>
        `

        setTimeout(() => {
          const nextBtn = document.getElementById("nextLevelBtn")
          if (nextBtn) {
            nextBtn.onclick = () => {
              // Update level selection
              document.querySelector(`input[value="${nextLevel}"]`).checked = true
              startGame(nextLevel)
            }
          }
        }, 100)
      }
    }
  }

  function renderWrongSummary() {
    const wrongSummary = document.getElementById("wrongSummary")
    if (!wrongSummary) return

    const wrongAnswers = userAnswers.filter((ans) => !ans.isCorrect)

    if (wrongAnswers.length === 0) {
      wrongSummary.innerHTML = `
        <div style="text-align: center; color: var(--success-color); font-weight: 600;">
          🎉 Perfect Score! All answers were correct!
        </div>
      `
      return
    }

    let html = "<h3>Review Your Mistakes</h3><ul>"
    wrongAnswers.forEach((ans, index) => {
      html += `
        <li>
          <div><span class="q">${ans.word}</span></div>
          <div>Your answer: <span class="y">${ans.selected || "No answer"}</span></div>
          <div>Correct answer: <span class="a">${ans.correct}</span></div>
        </li>
      `
    })
    html += "</ul>"
    wrongSummary.innerHTML = html
  }

  // Event listeners
  if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {
      const selectedRadio = document.querySelector('input[name="level"]:checked')
      if (selectedRadio) {
        const level = selectedRadio.value
        startGame(level)
      }
    })
  }

  if (playAgain) {
    playAgain.addEventListener("click", () => {
      startGame(currentLevel)
    })
  }

  // Add level selection animations
  const levelOptions = document.querySelectorAll(".level-option")
  levelOptions.forEach((option) => {
    option.addEventListener("mouseenter", () => {
      option.style.transform = "translateY(-2px)"
    })

    option.addEventListener("mouseleave", () => {
      option.style.transform = "translateY(0)"
    })
  })

  // Initialize
  levelSelect.style.display = "block"
  gameSection.style.display = "none"
  gameOver.style.display = "none"
})
