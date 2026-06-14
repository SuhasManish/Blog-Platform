const jwt = require('jsonwebtoken');

// Token Verification Middleware
exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  // Check if the token exists
  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided.' });
  }

  // Ensure the token format is 'Bearer <token>'
  if (!token.startsWith('Bearer ')) {
    return res.status(400).json({ message: 'Invalid token format. Token should be in "Bearer <token>" format.' });
  }

  try {
    // Extract token part after 'Bearer '
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    
    // Add decoded user information to the request
    req.user = decoded;
    
    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);  // Log error details for debugging
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// Admin Role Check Middleware
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin role required.' });
  }
  next();
};
