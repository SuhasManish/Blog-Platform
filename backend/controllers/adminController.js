const pool = require('../db');

// Get all users (only for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role FROM users ORDER BY id');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Update a user's role
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['normal', 'premium', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role type. Use "normal", "premium", or "admin".' });
  }

  try {
    const result = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role', [role, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Role updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
};
