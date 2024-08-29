const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
require("dotenv").config();


const app = express();

// Setup server port
const port = process.env.PORT || 8050;


app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())


// Configure Express session
app.use(session({
  secret: 'mySecretSQM',
  resave: false,
  saveUninitialized: false
}));


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  requireTLS: true,
  auth: {
    user: "sqm.client.master@gmail.com",
    pass: "Cylsys@2"
  }
});



app.post('/send-email', async (req, res) => {
  const { from, to, subject, text } = req.body;

  // Send email
  try {
      let info = await transporter.sendMail({
          from: 'gaurav.shinde592@gmail.com',
          to: 'gaurav.shinde@cylsys.com', // Convert array of recipients to comma-separated string
          subject: subject,
          text: text
      });
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
  } catch (err) {
      console.error(err);
      res.status(500).send('Failed to send email');
  }
});


app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to a page where the user can set their email as the sender
    res.redirect('/set-sender-email');
});



app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://watchappapi.cylsys.com/, http://localhost:34502/, http://103.228.83.115:34502");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials","true");
  next();
});

const cors = require('cors');
app.use(cors({
  origin: ["https://watch.cylsys.com", "https://watchappapi.cylsys.com", "http://localhost:34502", "http://103.228.83.115:34502"],
  credentials: true,
  methods: 'POST, GET, PUT, OPTIONS, DELETE'
  }));


app.get('/', (req, res) => {
  res.send("Hello World! Watchapp is live!!");
});




const routes = require('./src/routes/routes');



app.use(routes);
// app.use("/uploads/ApplicationLogo", express.static("uploads/ApplicationLogo"));
// app.use("/routes/CompanyLogo", express.static("./src/routes/CompanyLogo"));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});