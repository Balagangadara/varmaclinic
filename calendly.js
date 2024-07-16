const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/calendly-webhook', (req, res) => {
    const webhookEvent = req.body;
    
    // Log the webhook event for debugging
    console.log('Received webhook event:', webhookEvent);

    // Handle the webhook event (e.g., save data to a database)
    
    res.status(200).send('Webhook received');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.post('/submit-form', (req, res) => {
    const formData = req.body;

    // Combine formData with Calendly booking data (e.g., by matching email addresses)
    
    // Save the combined data to a database

    res.status(200).json({ message: 'Form data received' });
});
