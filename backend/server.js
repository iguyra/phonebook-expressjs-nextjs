require("dotenv").config();
const cookieParser = require("cookie-parser");
const errorController = require("./controllers/errorController");
const express = require("express");
const phonebook = require("./routes/phonebook");
const connectDB = require("./utils/connectDB");
const cors = require("cors");
const helmet = require("helmet");

// needs to be set before routes
process.on("uncaughtException", (err) => {
  console.log(err, "from uncaught exeptionn");
  process.exit();
});

connectDB();

const app = express();

let helmetOptions = {
  useDefaults: true,
  directives: {
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "font-src": ["'self'", "https:", "data:"],
    "frame-ancestors": ["'self'"],
    "img-src": ["'self'", "blob:", "data:", "https://res.cloudinary.com"],
    "media-src": ["'self'", "blob:", "data:", "https://res.cloudinary.com"],
    "script-src-attr": ["'none'"],
    "style-src": ["'self'", "https:", "'unsafe-inline'"],
  },
};

let corsOption = {
  credentials: true,

  origin: ["http://127.0.0.1:3000"],
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"], // to works well with web app, OPTIONS is required
};
app.use(cors(corsOption));

//SET SECURITY HTTP HEADERS
app.use(helmet.contentSecurityPolicy(helmetOptions));

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(express.json());

// enable ssl redirect
app.use(function (req, res, next) {
  if (req.header("x-forwarded-proto") === "http") {
    res.redirect(301, "https://" + req.hostname + req.url);
    return;
  }
  next();
});

app.use("/api/phonebook", phonebook);

app.get("/phonebook", (req, res) => {
  res.send("**");
});
app.use(errorController);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
