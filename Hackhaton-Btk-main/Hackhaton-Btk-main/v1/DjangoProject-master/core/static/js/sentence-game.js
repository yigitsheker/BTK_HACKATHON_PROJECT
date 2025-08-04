// Cümle Ustası - Sentence Master Game

document.addEventListener("DOMContentLoaded", () => {
  // DOM referansları
  const sentenceGameSection = document.getElementById("sentenceGameSection")
  const sentenceLevelSelect = document.getElementById("sentenceLevelSelect")
  const sentenceGamePlay = document.getElementById("sentenceGamePlay")
  const sentenceGameOver = document.getElementById("sentenceGameOver")
  const sentenceScoreSpan = document.getElementById("sentenceScore")
  const sentenceQuestionNumSpan = document.getElementById("sentenceQuestionNum")
  const sentenceTimeSpan = document.getElementById("sentenceTime")
  const sentenceQuestionDiv = document.getElementById("sentenceQuestion")
  const sentenceChoicesDiv = document.getElementById("sentenceChoices")
  const sentenceFeedbackDiv = document.getElementById("sentenceFeedback")
  const sentenceFinalScore = document.getElementById("sentenceFinalScore")
  const sentencePlayAgain = document.getElementById("sentencePlayAgain")
  const startSentenceGameBtn = document.getElementById("startSentenceGame")

  const sentenceGameState = {
    level: null,
    questions: [],
    current: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    timer: null,
    time: 0,
    userAnswers: [],
    canAnswer: true, // Her soruda sıfırla
  }

  const sentenceQuestionsData = {
    A2: [
      { type: "fill", q: "I ___ a student.", a: "am", choices: ["is", "am", "are", "be"] },
      { type: "fill", q: "She ___ to school every day.", a: "goes", choices: ["go", "goes", "going", "gone"] },
      { type: "fill", q: "They ___ happy.", a: "are", choices: ["is", "am", "are", "be"] },
      { type: "fill", q: "He ___ a book.", a: "reads", choices: ["read", "reads", "reading", "readed"] },
      { type: "fill", q: "We ___ at home.", a: "are", choices: ["is", "am", "are", "be"] },
      { type: "fill", q: "It ___ cold today.", a: "is", choices: ["is", "are", "am", "be"] },
      { type: "fill", q: "My father ___ a doctor.", a: "is", choices: ["is", "are", "am", "be"] },
      { type: "fill", q: "The children ___ playing.", a: "are", choices: ["is", "are", "was", "were"] },
      { type: "fill", q: "I ___ coffee every morning.", a: "drink", choices: ["drink", "drinks", "drinking", "drank"] },
      { type: "fill", q: "She ___ English well.", a: "speaks", choices: ["speak", "speaks", "speaking", "spoke"] },
    ],
    B1: [
      { type: "fill", q: "I ___ to the gym on Mondays.", a: "go", choices: ["go", "goes", "going", "gone"] },
      {
        type: "fill",
        q: "We ___ English for two years.",
        a: "have studied",
        choices: ["studied", "have studied", "studying", "study"],
      },
      {
        type: "fill",
        q: "She ___ coffee.",
        a: "doesn't like",
        choices: ["don't like", "doesn't like", "not like", "isn't like"],
      },
      { type: "fill", q: "They ___ never visited Istanbul.", a: "have", choices: ["has", "have", "had", "having"] },
      { type: "fill", q: "I ___ call you later.", a: "will", choices: ["will", "would", "shall", "should"] },
      { type: "fill", q: "The movie ___ very interesting.", a: "was", choices: ["is", "was", "were", "are"] },
      {
        type: "fill",
        q: "He ___ working here since 2020.",
        a: "has been",
        choices: ["is", "was", "has been", "have been"],
      },
      { type: "fill", q: "We ___ to the party yesterday.", a: "went", choices: ["go", "went", "gone", "going"] },
      { type: "fill", q: "She ___ finish her homework.", a: "must", choices: ["must", "can", "may", "might"] },
      { type: "fill", q: "I ___ seen this movie before.", a: "have", choices: ["has", "have", "had", "having"] },
    ],
    "B2-C1": [
      { type: "fill", q: "If I ___ more time, I would travel.", a: "had", choices: ["have", "had", "has", "having"] },
      {
        type: "fill",
        q: "She ___ three books so far.",
        a: "has written",
        choices: ["wrote", "has written", "writes", "writing"],
      },
      {
        type: "fill",
        q: "The results ___ announced tomorrow.",
        a: "will be",
        choices: ["will", "will be", "are", "is"],
      },
      {
        type: "fill",
        q: "He ___ to have finished the project.",
        a: "claims",
        choices: ["claim", "claims", "claimed", "claiming"],
      },
      {
        type: "fill",
        q: "They ___ the film yet.",
        a: "haven't seen",
        choices: ["didn't see", "haven't seen", "not see", "don't see"],
      },
      {
        type: "fill",
        q: "The book ___ by millions of people.",
        a: "has been read",
        choices: ["read", "was read", "has been read", "is reading"],
      },
      {
        type: "fill",
        q: "I wish I ___ speak French fluently.",
        a: "could",
        choices: ["can", "could", "would", "should"],
      },
      {
        type: "fill",
        q: "By next year, we ___ living here for 10 years.",
        a: "will have been",
        choices: ["will be", "will have been", "are", "have been"],
      },
      {
        type: "fill",
        q: "The meeting ___ postponed due to bad weather.",
        a: "was",
        choices: ["is", "was", "has been", "will be"],
      },
      { type: "fill", q: "She suggested that he ___ a doctor.", a: "see", choices: ["sees", "see", "saw", "seeing"] },
    ],
  }

  function shuffleArray(arr) {
    const newArr = [...arr]
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
    }
    return newArr
  }

  function startSentenceGameFlow(level) {
    sentenceGameState.level = level
    sentenceGameState.questions = []
    sentenceGameState.current = 0
    sentenceGameState.score = 0
    sentenceGameState.correct = 0
    sentenceGameState.wrong = 0
    sentenceGameState.userAnswers = []
    sentenceGameState.time = 0
    clearInterval(sentenceGameState.timer)
    // AI Modu ise placeholder göster
    if (level === "AI") {
      sentenceLevelSelect.style.display = "none"
      sentenceGamePlay.style.display = "none"
      sentenceGameOver.style.display = "flex"
      sentenceFinalScore.innerHTML = "AI Modu çok yakında!"
      return
    }
    // Soruları seç
    const pool = sentenceQuestionsData[level] || sentenceQuestionsData["A2"]
    sentenceGameState.questions = shuffleArray(pool).slice(0, 10)
    sentenceLevelSelect.style.display = "none"
    sentenceGamePlay.style.display = "flex"
    sentenceGameOver.style.display = "none"
    nextSentenceQuestion()
    // Zamanlayıcı başlat
    sentenceGameState.time = 0
    sentenceTimeSpan.textContent = sentenceGameState.time
    sentenceGameState.timer = setInterval(() => {
      sentenceGameState.time++
      sentenceTimeSpan.textContent = sentenceGameState.time
    }, 1000)
  }

  function getTimeForLevel(level) {
    if (level === "A2") return 10
    if (level === "B1") return 7
    if (level === "B2-C1") return 5
    return 7
  }

  function nextSentenceQuestion() {
    // Her yeni soruda eski timer'ı kesinlikle temizle
    if (sentenceGameState.timer) {
      clearInterval(sentenceGameState.timer)
      sentenceGameState.timer = null
    }

    if (sentenceGameState.current >= sentenceGameState.questions.length) {
      endSentenceGame()
      return
    }
    const qObj = sentenceGameState.questions[sentenceGameState.current]
    sentenceQuestionNumSpan.textContent = sentenceGameState.current + 1
    sentenceScoreSpan.textContent = sentenceGameState.score
    sentenceFeedbackDiv.textContent = ""

    let time = getTimeForLevel(sentenceGameState.level)
    sentenceTimeSpan.textContent = time
    sentenceGameState.canAnswer = true
    sentenceGameState.timer = setInterval(() => {
      time--
      if (time < 0) time = 0
      sentenceTimeSpan.textContent = time
      if (time === 0 && sentenceGameState.canAnswer) {
        sentenceGameState.canAnswer = false
        clearInterval(sentenceGameState.timer)
        handleTimeout(qObj)
      }
    }, 1000)

    if (["fill"].includes(qObj.type)) {
      sentenceQuestionDiv.innerHTML = qObj.q
      sentenceChoicesDiv.innerHTML = ""
      qObj.choices.forEach((choice) => {
        const btn = document.createElement("button")
        btn.className = "sentence-choice-btn"
        btn.textContent = choice
        btn.onclick = () => {
          if (!sentenceGameState.canAnswer) return
          sentenceGameState.canAnswer = false
          clearInterval(sentenceGameState.timer)
          selectSentenceChoice(choice)
        }
        sentenceChoicesDiv.appendChild(btn)
      })
    }
  }

  function handleTimeout(qObj) {
    sentenceFeedbackDiv.textContent = `Süre bitti! Doğru cevap: ${qObj.a}`
    sentenceFeedbackDiv.style.color = "#d32f2f"
    sentenceGameState.userAnswers.push({ q: qObj, user: null, correct: false })
    sentenceGameState.score -= 2
    sentenceGameState.wrong++
    setTimeout(() => {
      sentenceGameState.current++
      nextSentenceQuestion()
    }, 1000)
  }

  function selectSentenceChoice(choice) {
    const qObj = sentenceGameState.questions[sentenceGameState.current]
    let correct = false
    if (qObj.a === choice) {
      correct = true
      sentenceGameState.score += 10
      sentenceGameState.correct++
      sentenceFeedbackDiv.textContent = "Doğru!"
      sentenceFeedbackDiv.style.color = "#388e3c"
    } else {
      sentenceGameState.score -= 2
      sentenceGameState.wrong++
      sentenceFeedbackDiv.textContent = `Yanlış! Doğru cevap: ${qObj.a}`
      sentenceFeedbackDiv.style.color = "#d32f2f"
    }
    sentenceGameState.userAnswers.push({ q: qObj, user: choice, correct })
    setTimeout(() => {
      sentenceGameState.current++
      nextSentenceQuestion()
    }, 900)
  }

  function endSentenceGame() {
    clearInterval(sentenceGameState.timer)
    sentenceGamePlay.style.display = "none"
    sentenceGameOver.style.display = "flex"
    const accuracy = Math.round((sentenceGameState.correct / sentenceGameState.questions.length) * 100)
    sentenceFinalScore.innerHTML = `Doğru: <b>${sentenceGameState.correct}</b> / Yanlış: <b>${sentenceGameState.wrong}</b><br>Skor: <b>${sentenceGameState.score}</b><br>Doğruluk: <b>${accuracy}%</b>`
    // Yanlış cevap özetini göster
    const summaryDiv = document.getElementById("sentenceSummary")
    if (summaryDiv) {
      const wrongs = sentenceGameState.userAnswers.filter((ans) => !ans.correct)
      if (wrongs.length === 0) {
        summaryDiv.innerHTML = "<h3>Tebrikler! Tüm sorular doğru 🎉</h3>"
      } else {
        let html = "<h3>Yanlış Yaptığın Sorular</h3><ul>"
        wrongs.forEach((ans, i) => {
          const qText = ans.q.q
          const userAnswer = ans.user ?? "Cevap verilmedi"
          const correctAnswer = ans.q.a
          html += `
            <li style="margin-bottom:1em;">
              <div><strong>Soru ${i + 1}:</strong> ${qText}</div>
              <div><span style="color:#d32f2f;">Senin cevabın:</span> ${userAnswer}</div>
              <div><span style="color:#388e3c;">Doğru cevap:</span> ${correctAnswer}</div>
            </li>`
        })
        html += "</ul>"
        summaryDiv.innerHTML = html
      }
    }
  }

  // Silver, Gold, Platinum -> A2, B1, B2-C1 eşlemesi
  function getLevelFromRadio() {
    if (document.getElementById("glass-a2").checked) return "A2"
    if (document.getElementById("glass-b1").checked) return "B1"
    if (document.getElementById("glass-b2c1").checked) return "B2-C1"
    if (document.getElementById("glass-ai").checked) return "AI"
    return "A2"
  }

  if (startSentenceGameBtn) {
    startSentenceGameBtn.onclick = () => {
      const level = getLevelFromRadio()
      startSentenceGameFlow(level)
    }
  }
  if (sentencePlayAgain) {
    sentencePlayAgain.onclick = () => {
      // Sadece ekranları ayarla — oyunu baştan başlatma
      sentenceLevelSelect.style.display = "flex"
      sentenceGamePlay.style.display = "none"
      sentenceGameOver.style.display = "none"
    }
  }
})
