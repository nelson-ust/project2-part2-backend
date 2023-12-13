const express = require("express");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");

const axios = require("axios");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const indexController = require("../controllers/indexController");

require("dotenv").config();

const router = express.Router();

// Local strategy for username/password login
passport.use(new LocalStrategy(User.authenticate()));

// Configure Passport to use the local strategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://item-api-v2.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If the user doesn't exist, create a new user with the Google profile information
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            // Add any other relevant fields from the Google profile
          });
          await user.save();
        }

        // Pass the user to the callback
        return done(null, user);
      } catch (error) {
        console.error("Error during Google OAuth authentication:", error);
        return done(error, null);
      }
    }
  )
);

// Google OAuth login route
router.get("/auth/google", authController.googleLogin);

// Google OAuth callback route
router.get("/auth/google/callback", authController.googleCallback);

// Registration route
router.post("/register", userController.register);

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
          return res.status(500).json({
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
router.get("/logout", authController.logout);

// Protected route (example)
router.get("/protected", indexController.protectedRoute);

// Check Authentication Status Endpoint
// router.get("/check-auth", (req, res) => {
//   if (req.isAuthenticated()) {
//     // User is authenticated
//     res.json({ authenticated: true, user: req.user });
//   } else {
//     // User is not authenticated
//     res.json({ authenticated: false, user: null });
//   }
// });

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

module.exports = router;
