require("dotenv").config(); // loads variables from .env into process.env

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://annie-adrena-portfolio-site-fronten.vercel.app", // deployed frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow tools like curl/postman with no origin
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/annie-adrena-portfolio.*\.vercel\.app$/.test(origin);

    if (isAllowed) return callback(null, true);
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.options("/*", cors(corsOptions));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Contact API is running");
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  // temporary debug log — remove once working
  console.log("APP_PASSWORD loaded:", !!process.env.APP_PASSWORD);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "adrenahr.solutions@gmail.com",
        pass: process.env.APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <adrenahr.solutions@gmail.com>`, // Gmail requires "from" to match the authenticated account
      to: "adrenahr.solutions@gmail.com",
      replyTo: email,
      subject: `New message from ${name}`,
      text: message,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

// IMPORTANT: this must actually start the server on your host's assigned port
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;