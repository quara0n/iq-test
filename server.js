const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const sgMail = require('@sendgrid/mail');
require('dotenv').config(); // Load environment variables from .env file


const app = express();
const PORT = process.env.PORT || 3000;

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware for serving static files and parsing JSON requests
app.use(express.static('public'));
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./results.db', (err) => {
    if (err) {
        console.error('Could not connect to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create the `results` table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL
    )
`);

// Route for handling email submission
app.post('/send-email', (req, res) => {
    const { email, score, totalQuestions } = req.body;

    // Validate recipient email
    if (!email) {
        return res.status(400).send('Email address is required.');
    }

    // Save the result in the database
    db.run(
        `INSERT INTO results (email, score, total_questions) VALUES (?, ?, ?)`,
        [email, score, totalQuestions],
        function (err) {
            if (err) {
                console.error('Failed to save result:', err.message);
                return res.status(500).send('Could not save result.');
            }

            // Prepare the email message
            const msg = {
                to: email, // Recipient's email
                from: 'finne89@gmail.com', // Use your verified sender email
                subject: 'Your IQ Test Results',
                text: `Hello! You scored ${score} out of ${totalQuestions} on the IQ test. Great job!`,
            };

            // Send the email using SendGrid
            sgMail
                .send(msg)
                .then(() => {
                    console.log(`Email sent successfully to ${email}!`);
                    res.status(200).send('Result has been sent to your email!');
                })
                .catch((error) => {
                    console.error('Error sending email:', error.response ? error.response.body : error.message);
                    res.status(500).send('Could not send email. Please try again later.');
                });
        }
    );
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
