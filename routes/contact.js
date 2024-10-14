const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Create a new contact in the database
    const newContact = new Contact({
      name,
      email,
      message,
    });

    const savedContact = await newContact.save();

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
      from: `"${name}" <${email}>`, // Use the submitter's name and email
      to: process.env.EMAIL_USER, // Your email address (admin's email)
      replyTo: email, // Ensure replies go to the submitter
      subject: 'New Contact Form Submission',
      text: `You have a new contact form submission from ${name} (${email}):\n\n${message}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }
      console.log('Email sent:', info.response);
    });

    res.json(savedContact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Contact = require('../models/Contact');
// router.post('/', async (req, res) => {
//   const { name, email, message } = req.body;

//   try {
//     const newContact = new Contact({
//       name,
//       email, 
//       message,
//     });

//     const savedContact = await newContact.save();
//     res.json(savedContact);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const Contact = require('../models/Contact');
// const nodemailer = require('nodemailer');

// router.post('/', async (req, res) => {
//   const { name, email, message } = req.body;

//   try {
//     // Create a new contact in the database
//     const newContact = new Contact({
//       name,
//       email,
//       message,
//     });

//     const savedContact = await newContact.save();

//     // Set up the Nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail', // You can use any email service you prefer
//       auth: {
//         user: 'devesh123chauhan@gmail.com', // Your email address
//         pass: 'zako lvbn chuv mtxf', // Your email password or app-specific password
//       },
//     }); 

//     // Configure the email options
//     const mailOptions = {
//       from: 'devesh123chauhan@gmail.com',
//       to: email, // The email address to send to (could be the admin's email)
//       subject: 'New Contact Form Submission',
//       text: `You have a new contact form submission from ${name} (${email}):\n\n${message}`,
//     };

//     // Send the email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//         return res.status(500).send('Error sending email');
//       }
//       console.log('Email sent:', info.response);
//     });

//     res.json(savedContact);
//   } catch (err) {
//     console.error(err.message); 
//     res.status(500).send('Server Error');
//   }
// });

// module.exports = router;



