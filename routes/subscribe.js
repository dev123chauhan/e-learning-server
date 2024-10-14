// const express = require('express');
// const router = express.Router();
// const nodemailer = require('nodemailer');
// const dotenv = require("dotenv");
// const Subscribe = require('../models/Subscribe');

// dotenv.config();
// router.post('/', async (req, res) => {
//   const {  email } = req.body;

//   try {
//     // Create a new contact in the database
//     const newSubscriber = new Subscribe({
//       email,
//     });

//     const savedSubscriber = await newSubscriber.save();

//     // Set up the Nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Configure the email options
//     const mailOptions = {
//       from: `<${email}>`, // Use the submitter's name and email
//       to: process.env.EMAIL_USER, // Your email address (admin's email)
//       replyTo: email, // Ensure replies go to the submitter
//       subject: 'New Contact Form Submission',
//       text: `You have a new contact form submission from  (${email}):\n\n${message}`,
//     };

//     // Send the email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//         return res.status(500).send('Error sending email');
//       }
//       console.log('Email sent:', info.response);
//     });

//     res.json(savedSubscriber);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const Subscribe = require('../models/Subscribe');

dotenv.config();

router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is already subscribed
    const existingSubscribe = await Subscribe.findOne({ email });
    if (existingSubscribe) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    // Create a new subscriber
    const newSubscribe = new Subscribe({ email });
    const savedSubscribe = await newSubscribe.save();

    // Set up the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configure the email options
    const mailOptions = {
      from: `<${email}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: 'New Newsletter Subscription',
      text: `Thank you for subscribing to our newsletter!`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    res.status(201).json(savedSubscribe);
  } catch (err) {
    console.error('Error in subscription process:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;