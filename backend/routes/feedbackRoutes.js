const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, replyToFeedback } = require('../controllers/feedbackController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/submit', submitFeedback);
router.get('/all', verifyToken, isAdmin, getAllFeedback);
router.put('/reply/:id', verifyToken, isAdmin, replyToFeedback);

module.exports = router;
