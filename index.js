const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.post('/send-message', (req, res) => {
  const { email:senderEmail, message } = req.body;

//   console.log('Received request with data:', req.body); // Log the received data

  // Define the message content
  const content = `Sender's Email: ${senderEmail}\nMessage: ${message}\n\n`;

  // Append the message to a file
  fs.appendFile('msg.txt', content, (err) => {
    if (err) {
      console.error('Error saving message:', err);
      res.status(500).send(err.toString());
    } else {
      console.log('Message saved successfully.');
      res.status(200).send('Message saved successfully.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
