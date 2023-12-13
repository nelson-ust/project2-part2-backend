// user controller
const User = require('../models/userModel');

const userController = {
  register: async (req, res) => {
    try {
      console.log('Received registration request:', req.body);

      const newUser = new User({ username: req.body.username });
      await User.register(newUser, req.body.password);

      console.log('User registered successfully');

      res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = userController;
