const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const nodemailer = require('nodemailer');

require('dotenv').config();

const app = express();
const port = 5000;

const corsOption = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

const transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(transport);
transporter.verify((error, success) => {
  if (error) console.log(error);
  else console.log(success);
});

app.use(helmet());
app.use(cors(corsOption));
app.use(express.json());
app.use(morgan('common'));

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.post('/', (req, res, next) => {
  const { name, email, subject, message } = req.body;

  const mail = {
    from: email,
    to: process.env.EMAIL_ADDRESS,
    subject: subject,
    html: `<p>${message}</p><br/><p>Sender Name: ${name}</p><p>Sender Email: ${email}</p>`,
  };

  transporter.sendMail(mail, (error, data) => {
    if (error) res.json({ sent: false });
    else res.json({ sent: true });
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
