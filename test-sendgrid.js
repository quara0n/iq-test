const sgMail = require('@sendgrid/mail');

// Directly set your SendGrid API key here (replace with your actual API key)
sgMail.setApiKey('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'); // Replace with your API key

const msg = {
    to: 'finne89@gmail.com', // Replace with your recipient email
    from: 'finne89@gmail.com', // Replace with your verified sender email
    subject: 'Test Email from SendGrid',
    text: 'This is a test email sent using SendGrid!',
};

sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent successfully!');
    })
    .catch((error) => {
        console.error('Error sending email:', error.response ? error.response.body : error.message);
    });
