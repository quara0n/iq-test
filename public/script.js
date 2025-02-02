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

// Ensure the email page is hidden on initial load:
emailPage.classList.add("hidden");

// Get necessary DOM elements for certificate
const nameInput = document.getElementById("name-input"); // Ensure this exists in HTML
const emailInput = document.getElementById("email-input");
const sendEmailBtn = document.getElementById("send-email-btn");
const scoreMessage = document.getElementById("score-message");
const trustedBadge = document.querySelector(".trusted-badge");
const certificatePage = document.getElementById("certificate-page");
const certificateName = document.getElementById("certificate-name");
const certificateScore = document.getElementById("certificate-score");
const downloadCertificateBtn = document.getElementById("download-certificate-btn");

// Start Quiz
document.getElementById("start-btn").addEventListener("click", () => {
    landingPage.classList.add("hidden"); // Hide landing page
    quizPage.classList.remove("hidden"); // Show quiz page
    trustedBadge.classList.add("hidden"); // Hide trusted badge
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

    // Disable all answer buttons after selection
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
        // When quiz is done, hide quiz page and show email page
        quizPage.classList.add("hidden");
        emailPage.classList.remove("hidden");
        scoreMessage.textContent = `You scored ${score} out of ${questions.length}!`;
    }
});

// Submit Email and Generate Certificate
sendEmailBtn.addEventListener("click", () => {
    const userName = nameInput.value.trim();
    const userEmail = emailInput.value.trim();

    if (userName && userEmail) {
        // Display the certificate with the user's details
        certificateName.textContent = userName;
        certificateScore.textContent = `${score} out of ${questions.length}`;
        emailPage.classList.add("hidden");
        certificatePage.classList.remove("hidden");

        // Generate the certificate and send email
        generateCertificate(userName, score, userEmail);
    } else {
        alert("Please enter both your name and email.");
    }
});

// Function to generate and send the certificate
function generateCertificate(name, score, email) {
    html2canvas(document.getElementById("certificate-page")).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        // Use EmailJS or a backend API to send the email
        sendEmailWithCertificate(name, email, imgData);
    }).catch(error => {
        console.error("Error generating certificate:", error);
        alert("Failed to generate certificate. Please try again.");
    });
}

// Function to send email using EmailJS
function sendEmailWithCertificate(name, email, certificateImage) {
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        name: name,
        email: email,
        certificate_image: certificateImage
    }).then(() => {
        alert(`Certificate sent to ${email}`);
    }).catch(error => {
        console.error("Email failed:", error);
        alert("Failed to send certificate. Please try again.");
    });
}
