// backend/routes/protectedRoutes.js

const express = require('express');
const passport = require('passport');
const router = express.Router();

// Protected route
router.get('/protected', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'You are authenticated!' });
});

module.exports = router;
