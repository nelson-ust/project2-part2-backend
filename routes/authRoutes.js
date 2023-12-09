const express = require("express");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

require('dotenv').config()

const router = express.Router();

// Initiates the Google Login flow
router.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${SESSION_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

// Callback URL for handling the Google Login response
router.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: SESSION_ID,
      client_secret: SESSION_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, id_token } = data;

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Code to handle user authentication and retrieval using the profile data

    res.redirect('/');
  } catch (error) {
    console.error('Error:', error.response.data.error);
    res.redirect('/login');
  }
});

router.post("/register", async (req, res) => {
  try {
    console.log("Received registration request:", req.body);

    const newUser = new User({ username: req.body.username });
    await User.register(newUser, req.body.password);

    console.log("User registered successfully");

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Login route with data validation
router.post(
  "/login",
  [
    body("username").notEmpty().isString(),
    body("password").notEmpty().isString(),
  ],
  (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }
      if (!user) {
        return res.status(401).json({ authenticated: false, user: null });
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error(loginErr);
          return res
            .status(500)
            .json({
              error: "Internal Server Error",
              details: loginErr.message,
            });
        }

        // Log the user object to see its structure
        console.log("Authenticated User:", req.user);

        res.status(200).json({ authenticated: true, user: req.user });
      });
    })(req, res, next);
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout(); // Destroy the user session
  res.json({ message: "Logged out successfully" });
});

// Protected route (example)
router.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: "You are authenticated!" });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
