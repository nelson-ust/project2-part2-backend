// backend/passport-config.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const bcrypt = require('bcryptjs');

const User = require('./models/user'); // Assuming you have a User model

passport.use(new LocalStrategy(User.authenticate()));

// Add OAuth2 strategy configuration here

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
