const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('cross-fetch');
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


app.post('/send-message', async (req, res) => {
  const { email: senderEmail, message, hCaptchaToken } = req.body;

  // Verify hCaptcha token
  const hCaptchaSecretKey = process.env.HCAPTCHA_SECRET_KEY;
  const hCaptchaVerifyUrl = 'https://hcaptcha.com/siteverify';

  const verificationResult = await fetch(hCaptchaVerifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${hCaptchaSecretKey}&response=${hCaptchaToken}`,
  });

  const verificationData = await verificationResult.json();

  if (verificationData.success) {
    // hCaptcha verification successful

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
  } else {
    // hCaptcha verification failed
    res.status(403).send('hCaptcha verification failed.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
