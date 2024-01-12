const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:3000', 'https://portfolio-aish.web.app'],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.post('/send-message', (req, res) => {
  const { email: senderEmail, message } = req.body;

  // Define the message content
  const content = `Sender's Email: ${senderEmail}\nMessage: ${message}\n\n`;

  // Append the message to a file
  fs.appendFile('msg.txt', content, (err) => {
    if (err) {
      console.error('Error saving message:', err);
      res.status(500).send(err.toString());
    } else {
      console.log('Message saved successfully.');
      res.status(200).json({ message: 'Message saved successfully.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
