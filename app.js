// app.js file
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

require('dotenv').config()


const swaggerSetup = require('./swagger');
// const itemRoutes = require('./routes/itemRoutes');

const itemRoutes = require("./routes/itemRoutes");
const authRoutes = require("./routes/authRoutes")

// require("dotenv").config();

const app = express();

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,  // Replace with your actual secret key
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    },
  })
);


// Middleware
app.use(bodyParser.json());

// Use cors middleware with options
app.use(
  cors({
    origin: "https://cse341-project2-frontend.onrender.com", // i will replace with the actual frontend name
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);

// Initialize Passport and restore authentication state if available
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// API routes
app.use("/items", itemRoutes);
app.use('/api-docs', swaggerSetup.serve, swaggerSetup.setup);
app.use("/auth", authRoutes);

// Swagger documentation setup
// swaggerSetup(app);

// Server setup
const PORT =  4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
