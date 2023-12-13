// This controller will handle actions related to your protected route.
const indexController = {
  protectedRoute: (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ message: 'You are authenticated!' });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  },
};

module.exports = indexController;
