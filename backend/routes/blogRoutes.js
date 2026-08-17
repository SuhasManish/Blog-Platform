const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');

const blogController = require('../controllers/blogController');
const { verifyToken } = require('../middleware/authMiddleware');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1'
});

const bucket = process.env.S3_BUCKET || 'blog-platform-india';

const upload = multer({
  storage: multerS3({
    s3,
    bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: function (req, file, cb) {
      const ext = path.extname(file.originalname);

      const filename =
        Date.now() + '-' +
        Math.round(Math.random() * 1E9) +
        ext;

      cb(null, `uploads/${filename}`);
    }
  }),

  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

router.post(
  '/',
  verifyToken,
  upload.single('media'),
  blogController.createBlog
);

router.get('/', verifyToken, blogController.getAllBlogs);

router.get('/:id', blogController.getBlogById);

router.put(
  '/:id',
  verifyToken,
  upload.single('media'),
  blogController.updateBlog
);

router.delete('/:id', verifyToken, blogController.deleteBlog);

module.exports = router;
