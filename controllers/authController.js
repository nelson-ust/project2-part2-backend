// auth controller logic for OAuth
const passport = require('passport');
const express = require('express');
const router = express.Router();

const authController = {
  googleLogin: passport.authenticate('google', { scope: ['profile', 'email'] }),

  googleCallback: passport.authenticate('google', { failureRedirect: '/login' }),

  logout: (req, res) => {
    req.logout(() => {
      // Optional: Perform any additional actions after logout
      res.json({ message: 'Logged out successfully' });
    });
  },
};

module.exports = authController;
