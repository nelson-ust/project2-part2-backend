const User = require('../models/userModel');

const userController = {
  register: async (req, res) => {
    try {
      console.log('Received registration request:', req.body);

      // Check if the username is already taken
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        console.error('Username is already taken:', req.body.username);
        return res.status(400).json({ error: 'Username is already taken' });
      }

      // Create a new user instance and save it to the database
      const newUser = new User({ username: req.body.username, password: req.body.password });
      await newUser.save();

      console.log('User registered successfully');

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = userController;
