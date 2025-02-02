const questions = [
    {
        text: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correct: "4",
    },
    {
        text: "What is the capital of Norway?",
        options: ["Stockholm", "Oslo", "Copenhagen", "Helsinki"],
        correct: "Oslo",
    },
    {
        text: "What color do you get when you mix blue and yellow?",
        options: ["Green", "Purple", "Orange", "Red"],
        correct: "Green",
    },
    {
        text: "What animal is known as the 'King of the Jungle'?",
        options: ["Lion", "Tiger", "Elephant", "Cheetah"],
        correct: "Lion",
    },
];

let currentQuestion = 0;
let score = 0;

// DOM Elements
const landingPage = document.getElementById("landing-page");
const quizPage = document.getElementById("quiz-page");
const emailPage = document.getElementById("email-page");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const emailInput = document.getElementById("email-input");
const sendEmailBtn = document.getElementById("send-email-btn");
const scoreMessage = document.getElementById("score-message");

// Start Quiz
document.getElementById("start-btn").addEventListener("click", () => {
    landingPage.classList.add("hidden");
    quizPage.classList.remove("hidden");
    loadQuestion();
});

// Load Question
function loadQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.text;
    answerOptions.innerHTML = "";

    question.options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("answer-btn");
        button.addEventListener("click", () => selectAnswer(button, question.correct));
        answerOptions.appendChild(button);
    });

    nextBtn.disabled = true;
}

// Select Answer
function selectAnswer(button, correctAnswer) {
    if (button.textContent === correctAnswer) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");
    }

    [...answerOptions.children].forEach((btn) => (btn.disabled = true));
    nextBtn.disabled = false;
}

// Next Question
nextBtn.addEventListener("click", () => {
    currentQuestion++;
    progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        quizPage.classList.add("hidden");
        emailPage.classList.remove("hidden");
        scoreMessage.textContent = `You scored ${score} out of ${questions.length}!`;
    }
});

// Send Email
sendEmailBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    if (email) {
        alert(`Your score: ${score}/${questions.length}. Results sent to: ${email}`);
    } else {
        alert("Please enter a valid email.");
    }
});
