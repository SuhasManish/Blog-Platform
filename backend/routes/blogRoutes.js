const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const blogController = require('../controllers/blogController');
const { verifyToken } = require('../middleware/authMiddleware'); // Auth middleware

// Set up Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1714929128391.jpg
  }
});
const upload = multer({ storage });

// Route to create a blog post (supports file upload)
router.post('/', verifyToken, upload.single('media'), blogController.createBlog);

// Route to get all blogs
router.get('/', verifyToken, blogController.getAllBlogs);

// Route to get a blog by ID
router.get('/:id', blogController.getBlogById);

// Route to update a blog post (supports file upload)
router.put('/:id', verifyToken, upload.single('media'), blogController.updateBlog);

// Route to delete a blog post
router.delete('/:id', verifyToken, blogController.deleteBlog);

module.exports = router;
