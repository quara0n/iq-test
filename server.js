const express = require("express");
const nodemailer = require("nodemailer");
const sqlite3 = require("sqlite3").verbose(); // Bruk SQLite

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

// Opprett SQLite-database
const db = new sqlite3.Database("./results.db", (err) => {
    if (err) {
        console.error("Kunne ikke koble til databasen:", err.message);
    } else {
        console.log("Koblet til SQLite-database.");
    }
});

// Opprett tabell for å lagre resultater
db.run(`
    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL
    )
`);

// Nodemailer-konfigurasjon
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "din_email@gmail.com", // Sett inn din Gmail-adresse
        pass: "ditt_passord"         // Bruk app-passord hvis du har 2FA aktivert
    }
});

// Rute for å lagre resultater og sende e-post
app.post("/send-email", (req, res) => {
    const { email, score, totalQuestions } = req.body;

    // Lagre resultat i databasen
    db.run(
        `INSERT INTO results (email, score, total_questions) VALUES (?, ?, ?)`,
        [email, score, totalQuestions],
        function (err) {
            if (err) {
                console.error("Kunne ikke lagre resultat:", err.message);
                return res.status(500).send("Kunne ikke lagre resultat.");
            }

            // Send e-post med resultat
            const mailOptions = {
                from: "din_email@gmail.com", // Din Gmail-adresse
                to: email,
                subject: "IQ-test Resultat",
                text: `Hei! Du fikk ${score} av ${totalQuestions} riktige på IQ-testen vår. Gratulerer!`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Kunne ikke sende e-post:", error.message);
                    return res.status(500).send("Kunne ikke sende e-post.");
                }

                console.log("E-post sendt:", info.response);
                res.status(200).send("Resultatet er sendt på e-post!");
            });
        }
    );
});

// Start serveren
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
