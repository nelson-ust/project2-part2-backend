// models/itemModel.js

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Enhance the user schema with Passport-Local Mongoose functionality
userSchema.plugin(passportLocalMongoose);

// Create the User model based on the user schema
const User = mongoose.model('User', userSchema);

module.exports = User;

