const mongoose = require('mongoose');

// Define the BlogPost schema
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  imagePath: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });


const Blog = mongoose.model('Blog', blogPostSchema);
module.exports = Blog;
