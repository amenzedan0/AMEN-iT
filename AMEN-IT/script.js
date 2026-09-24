// ===============================
// AMEN iT - IQ CHALLENGE
// ===============================

let email = localStorage.getItem("amen_email");

let coins = Number(localStorage.getItem("amen_coins")) || 0;

let completedLevel =
    Number(localStorage.getItem("amen_completed")) || 0;

let currentLevel = 1;
let questionIndex = 0;

let soundEnabled =
    localStorage.getItem("amen_sound") !== "false";

let volume =
    Number(localStorage.getItem("amen_volume")) || 0.5;

let removedAnswers = false;


// ===============================
// QUESTION BANK
// ===============================

const questionBank = [

    {
        q: "کام لەمانە گەورەترین ژمارەیە؟",
        a: ["12", "25", "19", "8"],
        correct: 1
    },

    {
        q: "ئەگەر 5 + 7 = ؟",
        a: ["10", "11", "12", "13"],
        correct: 2
    },

    {
        q: "کام ئاژەڵ زۆرجار بە پاشای ئاژەڵان ناسراوە؟",
        a: ["پشیلە", "شێر", "ئەسپ", "گەورە"],
        correct: 1
    },

    {
        q: "ژمارەی ڕۆژەکانی هەفتە چەندە؟",
        a: ["5", "6", "7", "8"],
        correct: 2
    },

    {
        q: "H2O چییە؟",
        a: ["ئاو", "ئاسن", "ئۆکسجین", "نمک"],
        correct: 0
    },

    {
        q: "ئەگەر 10 × 5 = ؟",
        a: ["40", "45", "50", "55"],
        correct: 2
    },

    {
        q: "کام لەمانە سیستەمی کارپێکردنی کۆمپیوتەرە؟",
        a: ["Windows", "Keyboard", "Mouse", "Monitor"],
        correct: 0
    },

    {
        q: "کام ڕەنگ لەگەڵ شین تێکەڵ بکرێت زۆرجار سەوز دروست دەکات؟",
        a: ["زەرد", "ڕەش", "سپی", "پەمەیی"],
        correct: 0
    },

    {
        q: "ئەگەر 100 - 35 = ؟",
        a: ["55", "65", "75", "85"],
        correct: 1
    },

    {
        q: "کامەیان سیارەیە؟",
        a: ["خۆر", "مانگ", "زەوی", "ئەستێرە"],
        correct: 2
    }

];


// ===============================
// CREATE 1000 LEVELS
// ===============================

function getQuestionsForLevel(level) {

    const questions = [];

    for (let i = 0; i < 10; i++) {

        const base =
            questionBank[
                (level * 10 + i) %
                questionBank.length
            ];

        questions.push({
            q: base.q,
            a: [...base.a],
            correct: base.correct
        });

    }

    return questions;
}


// ===============================
// LOGIN
// ===============================

function login() {

    const input =
        document.getElementById("emailInput");

    const value = input.value.trim();

    if (!value || !value.includes("@")) {

        alert("تکایە ئیمەیڵێکی دروست بنووسە");

        return;
    }

    email = value;

    localStorage.setItem(
        "amen_email",
        email
    );

    showGame();
}


// ===============================
// START
// ===============================

function showGame() {

    document
        .getElementById("loginScreen")
        .classList.add("hidden");

    document
        .getElementById("gameScreen")
        .classList.remove("hidden");

    document
        .getElementById("playerEmail")
        .textContent = email;

    updateCoins();

    renderLevels();
}


// ===============================
// LEVELS
// ===============================

function renderLevels() {

    const container =
        document.getElementById("levels");

    container.innerHTML = "";

    for (let level = 1; level <= 1000; level++) {

        const button =
            document.createElement("div");

        button.className = "level";

        if (level <= completedLevel) {

            button.classList.add("completed");

            button.innerHTML = `
                <div class="level-number">
                    ${level}
                </div>
                <div>✓ تەواو</div>
            `;

        } else if (level === completedLevel + 1) {

            button.classList.add("current");

            button.innerHTML = `
                <div class="level-number">
                    ${level}
                </div>
                <div>▶ دەستپێبکە</div>
            `;

            button.onclick =
                () => startLevel(level);

        } else {

            button.classList.add("locked");

            button.innerHTML = `
                <div class="level-number">
                    🔒
                </div>
                <div>${level}</div>
            `;
        }

        container.appendChild(button);
    }

    updateProgress();
}


// ===============================
// START LEVEL
// ===============================

function startLevel(level) {

    if (level > completedLevel + 1) return;

    currentLevel = level;
    questionIndex = 0;
    removedAnswers = false;

    document
        .getElementById("levelsSection")
        .classList.add("hidden");

    document
        .getElementById("quizSection")
        .classList.remove("hidden");

    showQuestion();
}


// ===============================
// QUESTION
// ===============================

function showQuestion() {

    const questions =
        getQuestionsForLevel(currentLevel);

    const data =
        questions[questionIndex];

    document
        .getElementById("currentLevel")
        .textContent = currentLevel;

    document
        .getElementById("questionNumber")
        .textContent = questionIndex + 1;

    document
        .getElementById("question")
        .textContent = data.q;

    const answers =
        document.getElementById("answers");

    answers.innerHTML = "";

    data.a.forEach((answer, index) => {

        const button =
            document.createElement("button");

        button.className = "answer";

        button.textContent =
            `${index + 1}. ${answer}`;

        button.onclick =
            () => checkAnswer(index);

        answers.appendChild(button);
    });

    document
        .getElementById("helpButton")
        .style.display =
        removedAnswers ? "none" : "flex";
}


// ===============================
// ANSWER
// ===============================

function checkAnswer(selected) {

    const questions =
        getQuestionsForLevel(currentLevel);

    const data =
        questions[questionIndex];

    const buttons =
        document.querySelectorAll(".answer");

    buttons.forEach(btn => {
        btn.style.pointerEvents = "none";
    });

    if (selected === data.correct) {

        buttons[selected]
            .classList.add("correct");

        coins += 20;

        saveCoins();

        playCorrect();

        setTimeout(() => {

            questionIndex++;

            if (questionIndex >= 10) {

                finishLevel();

            } else {

                showQuestion();
            }

        }, 900);

    } else {

        buttons[selected]
            .classList.add("wrong");

        buttons[data.correct]
            .classList.add("correct");

        playWrong();

        setTimeout(() => {

            buttons.forEach(btn => {
                btn.style.pointerEvents = "auto";
            });

        }, 700);
    }
}


// ===============================
// REMOVE 2 ANSWERS
// ===============================

function removeAnswers() {

    if (coins < 50) {

        alert("کۆینی پێویستت نییە! 50 🪙 پێویستە.");

        return;
    }

    coins -= 50;

    saveCoins();

    removedAnswers = true;

    const questions =
        getQuestionsForLevel(currentLevel);

    const correct =
        questions[questionIndex].correct;

    const buttons =
        document.querySelectorAll(".answer");

    let removed = 0;

    buttons.forEach((button, index) => {

        if (
            index !== correct &&
            removed < 2
        ) {

            button.classList.add("disabled");

            removed++;
        }
    });

    document
        .getElementById("helpButton")
        .style.display = "none";
}


// ===============================
// FINISH LEVEL
// ===============================

function finishLevel() {

    if (currentLevel > completedLevel) {

        completedLevel = currentLevel;

        localStorage.setItem(
            "amen_completed",
            completedLevel
        );
    }

    playLevelComplete();

    setTimeout(() => {

        alert(
            `🎉 پیرۆزە!\nمەرحەلەی ${currentLevel} تەواو کرا!`
        );

        backToLevels();

    }, 600);
}


// ===============================
// BACK TO LEVELS
// ===============================

function backToLevels() {

    document
        .getElementById("quizSection")
        .classList.add("hidden");

    document
        .getElementById("levelsSection")
        .classList.remove("hidden");

    renderLevels();
}


// ===============================
// COINS
// ===============================

function saveCoins() {

    localStorage.setItem(
        "amen_coins",
        coins
    );

    updateCoins();
}

function updateCoins() {

    document
        .getElementById("coins")
        .textContent = coins;

    document
        .getElementById("quizCoins")
        .textContent = coins;
}


// ===============================
// PROGRESS
// ===============================

function updateProgress() {

    document
        .getElementById("progressText")
        .textContent =
        `${completedLevel} / 1000`;

    const percent =
        (completedLevel / 1000) * 100;

    document
        .getElementById("progressBar")
        .style.width = `${percent}%`;
}


// ===============================
// SETTINGS
// ===============================

function openSettings() {

    document
        .getElementById("settings")
        .classList.remove("hidden");

    document
        .getElementById("soundToggle")
        .checked = soundEnabled;

    document
        .getElementById("volume")
        .value = volume;
}

function closeSettings() {

    document
        .getElementById("settings")
        .classList.add("hidden");
}

function changeSound() {

    soundEnabled =
        document.getElementById(
            "soundToggle"
        ).checked;

    localStorage.setItem(
        "amen_sound",
        soundEnabled
    );
}

function changeVolume() {

    volume =
        Number(
            document.getElementById(
                "volume"
            ).value
        );

    localStorage.setItem(
        "amen_volume",
        volume
    );
}


// ===============================
// SIMPLE SOUNDS
// ===============================

function beep(frequency, duration) {

    if (!soundEnabled) return;

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    const ctx = new AudioContext();

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.frequency.value =
        frequency;

    gain.gain.value = volume;

    oscillator.connect(gain);

    gain.connect(ctx.destination);

    oscillator.start();

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + duration
    );

    oscillator.stop(
        ctx.currentTime + duration
    );
}

function playCorrect() {

    beep(700, .12);

    setTimeout(() => {
        beep(1000, .15);
    }, 120);
}

function playWrong() {

    beep(220, .25);
}

function playLevelComplete() {

    beep(600, .15);

    setTimeout(() => {
        beep(800, .15);
    }, 150);

    setTimeout(() => {
        beep(1100, .25);
    }, 300);
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("amen_email");

    location.reload();
}


// ===============================
// AUTO LOGIN
// ===============================

if (email) {

    showGame();

}