const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const blocked = require('./blocked_slots.json');

const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/slots', (req, res) => {
  res.json(blocked);
});

app.post('/submit', (req, res) => {
  const { parentName, studentName, level, subject } = req.body;
  const slots = req.body.slots;
  const slotList = Array.isArray(slots) ? slots.join(', ') : slots || 'None';

  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      user: 'user@example.com',
      pass: 'password'
    }
  });

  const mailOptions = {
    from: 'waiting-list@example.com',
    to: 'YOUR_EMAIL@example.com',
    subject: 'New waiting list submission',
    text: `Parent Name: ${parentName}\nStudent Name: ${studentName}\nLevel: ${level}\nSubject: ${subject}\nPreferred Slots: ${slotList}`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error sending email');
    }
    res.send('Thank you for joining the waiting list');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
