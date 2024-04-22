
// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');

const authController = {
   register: async (req, res) => {
    try {
      const { username, password, email } = req.body;
  
      // Check if there are any users in the database
      const existingUsersCount = await User.countDocuments();
  
      // Determine the value of isAdmin based on whether it's the first user or not
      const isAdmin = existingUsersCount === 0;
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with username, hashed password, email, and isAdmin
      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        isAdmin,
      });
  
      // Save the new user to the database
      await newUser.save();
  
      res.redirect('/auth/login');
    } catch (error) {
      console.error(error);
      res.redirect('/auth/register');
    }
  },
  
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find the user by username
      const user = await User.findOne({ username });
      // Check if the user exists and if the password is correct
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.redirect('/auth/register');
      }

      // Store user information in the session
      req.session.user = user;
      res.redirect('/blog');
    } catch (error) {
      console.error(error);
     
      res.redirect('/auth/login');
    }
  },

  logout: (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy(() => {
      res.redirect('/blog');
    });
  },
};

module.exports = authController;
