// routes/authRoutes.js

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

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API operations related to user authentication
 */

/**
 * @swagger
 * /auth/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: Redirects to Google OAuth login page
 */

router.get("/auth/google", authController.googleLogin);

/**
 * @swagger
 * /auth/auth/google/callback:
 *   get:
 *     summary: Callback for Google OAuth login
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: Handles Google OAuth callback
 */

router.get("/auth/google/callback", authController.googleCallback);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newUser
 *               password:
 *                 type: string
 *                 example: newPassword
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User registered successfully
 *       '400':
 *         description: Bad request. Check request body format.
 *       '500':
 *         description: Internal server error
 */
router.post("/register", userController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in as an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: existingUser
 *               password:
 *                 type: string
 *                 example: existingPassword
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User logged in successfully
 *       '401':
 *         description: Unauthorized. Invalid username or password.
 *       '400':
 *         description: Bad request. Check request body format.
 *       '500':
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out the current user
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: User logged out successfully
 */

router.get("/logout", authController.logout);

/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: Example protected route
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: Protected route accessed successfully
 */

router.get("/protected", indexController.protectedRoute);

// Check Authentication Status Endpoint
router.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated
    res.json({ authenticated: true, user: req.user });
  } else {
    // User is not authenticated, redirect to login page
    res.status(401).json({ authenticated: false, user: null, redirect: "/login.html" });
  }
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

module.exports = router;
