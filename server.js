// server.js
const express = require("express");
const dotenv = require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// POST route for contact form
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Configure mail transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "adrenahr.solutions@gmail.com", // replace with your email
        pass: process.env.APP_PASSWORD,   // use Gmail App Password
      },
    });

    // Send email
    await transporter.sendMail({
      from: email,
      to: "adrenahr.solutions@gmail.com", // your receiving email
      replyTo: email,
      subject: `New message from ${name}`,
      text: message,
    });

    res.status(200).send("Message sent successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending message.");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
