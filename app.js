// app.js file
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/userModel");

const swaggerSetup = require('./swagger');
// const itemRoutes = require('./routes/itemRoutes')

const itemRoutes = require("./routes/itemRoutes");
const authRoutes = require("./routes/authRoutes")

require("dotenv").config();

const app = express();

// Connect to MongoDB using Mongoose
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const dbURI = process.env.MONGODB_URI || 'mongodb+srv://nigerianprogramer:Abuja2Mars@cluster0.5txx9he.mongodb.net/itemdb?retryWrites=true&w=majority';

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,  // Replace with your actual secret key
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
    origin: "https://cse341-project2-frontend.onrender.com",
    // origin: "http://127.0.0.1:5500",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);

// Initialize Passport and restore authentication state if available
// app.use(passport.initialize());
// app.use(passport.session());

// // Passport Configuration
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// API routes
app.use("/items", itemRoutes);
app.use('/api-docs', swaggerSetup.serve, swaggerSetup.setup);
app.use("/auth", authRoutes);

// Swagger documentation setup
// swaggerSetup(app);

// Server setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
