const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');
const blogController = require('../controllers/blogController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Existing routes
router.get('/', blogController.viewHomePage);
router.get('/all-blogs', blogController.viewAllBlogs);
router.get('/add-blog', ensureAuthenticated, ensureAdmin, (req, res) => {
  res.render('add-blog', { user: req.session.user });
});
router.post('/add-blog', ensureAuthenticated, ensureAdmin, upload.single('image'), blogController.addBlog);
router.get('/single-blog/:id', blogController.viewSingleBlog);
// New route for user settings
router.get('/settings', ensureAuthenticated, (req, res) => {
  res.render('settings', { user: req.session.user });
});
// New route for updating user details
router.post('/settings/update', ensureAuthenticated, blogController.updateUser);
// New route for deleting user account
router.post('/settings/delete', ensureAuthenticated, blogController.deleteAccount);
module.exports = router;
