const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Get all users (admin only)
router.get('/users', verifyToken, isAdmin, getAllUsers);

router.put('/users/:id/role', verifyToken, isAdmin, updateUserRole);

module.exports = router;
