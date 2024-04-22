const User = require('../models/User');
const Blog = require('../models/Blog');
const bcrypt = require('bcrypt');


const blogController = {
  viewHomePage: async (req, res) => {
    try {
      const homePageBlogs = await Blog.find().limit(4);
      const allBlogs = await Blog.find();
      res.render('home', { homePageBlogs, allBlogs, user: req.session.user });
    } catch (error) {
      console.error('Error in viewHomePage:', error);
      res.render('error', { error, user: req.session.user });
    }
  },
  viewSingleBlog: async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      res.render('single-blog', { singleBlog: blog, user: req.session.user });
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  },
  
viewAllBlogs: async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render('blogs', { blogs, user: req.session.user });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
},
addBlog: async (req, res) => {
  const { title, content } = req.body;
  try {
    const newBlog = new Blog({
      title,
      content,
      imagePath: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await newBlog.save();
    const user = await User.findById(req.session.user._id);
    user.blog.push(newBlog._id);
    await user.save();

    res.redirect('/blog/all-blogs');
  } catch (error) {
    console.error(error);
    res.redirect('/blog/all-blogs');
  }
},
updateUser: async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Retrieve the user from the database
    const user = await User.findById(req.session.user._id);

    // Update user details
    user.name = name;
    user.email = email;

    // Check if a new password is provided
    if (password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user to the database
    await user.save();

    // Redirect to the settings page or any other page you prefer
    res.redirect('/blog/settings');
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.redirect('/blog'); // Redirect to the home page or an error page
  }
},
deleteAccount: async (req, res) => {
  try {
    // console.log('Request Body:', req.body);

    // Retrieve the user from the database
    const user = await User.findById(req.session.user._id);
    // console.log('User:', user);

    if (!user) {
      // Handle case where the user is not found
      console.log('User not found.');
      return res.redirect('/blog/settings');
    }

    // Check if the provided password is not empty
    if (!req.body.passwordToDelete) {
      // Handle case where the password is empty
      console.log('Password is empty.');
      return res.redirect('/blog/settings');
    }

    // Check if the provided password matches the user's password
    const isPasswordMatch = await bcrypt.compare(req.body.passwordToDelete, user.password);

    if (!isPasswordMatch) {
      // Handle case where the password does not match
      console.log('Password does not match.');
      return res.redirect('/blog/settings');
    }

    // Remove the user from the database
    await User.deleteOne({ _id: user._id });

    // Redirect to the home page or any other page you prefer
    res.redirect('/blog');

  } catch (error) {
    console.error('Error in deleteAccount:', error);
    res.redirect('/blog/settings'); // Redirect to the settings page or an error page
  }
},
};

module.exports = blogController;

