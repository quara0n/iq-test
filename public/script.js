const questions = [
    {
        text: "Hva er 2 + 2?",
        options: ["3", "4", "5"],
        correct: "4"
    },
    {
        text: "Hva er hovedstaden i Norge?",
        options: ["Stockholm", "Oslo", "København"],
        correct: "Oslo"
    },
    {
        text: "Hvilken farge får du hvis du blander blått og gult?",
        options: ["Grønn", "Lilla", "Oransje"],
        correct: "Grønn"
    },
    {
        text: "Hvilket dyr er kjent som 'Kongen av jungelen'?",
        options: ["Løve", "Tiger", "Elefant"],
        correct: "Løve"
    }
];

let currentQuestion = 0;
let score = 0;

const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const emailForm = document.getElementById("email-form");
const emailInput = document.getElementById("email-input");
const sendEmailBtn = document.getElementById("send-email-btn");

function loadQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.text;
    answerOptions.innerHTML = "";

    question.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => selectAnswer(button, question.correct);
        answerOptions.appendChild(button);
    });
}

function selectAnswer(button, correctAnswer) {
    const buttons = answerOptions.querySelectorAll("button");
    buttons.forEach(btn => btn.disabled = true);

    if (button.textContent === correctAnswer) {
        button.style.backgroundColor = "#28a745";
        score++;
    } else {
        button.style.backgroundColor = "#dc3545";
    }

    nextBtn.disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;

    if (currentQuestion < questions.length) {
        loadQuestion();
        nextBtn.disabled = true;
    } else {
        showEmailForm();
    }
}

function showEmailForm() {
    document.getElementById("quiz-card").style.display = "none";
    emailForm.style.display = "block";
}

function sendEmail() {
    const email = emailInput.value;
    if (email) {
        fetch("/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                score: score,
                totalQuestions: questions.length
            })
        })
        .then(response => {
            if (response.ok) {
                alert("Resultatet er sendt til e-posten din!");
                emailInput.value = "";
            } else {
                alert("Kunne ikke sende e-post. Prøv igjen senere.");
            }
        })
        .catch(error => console.error("Feil:", error));
    } else {
        alert("Vennligst fyll inn en gyldig e-postadresse.");
    }
}

nextBtn.addEventListener("click", nextQuestion);
sendEmailBtn.addEventListener("click", sendEmail);

// Last inn første spørsmål
loadQuestion();
