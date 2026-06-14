const pool = require('../db');

exports.submitFeedback = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO feedback (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Feedback error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get feedback error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Reply to feedback
exports.replyToFeedback = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;
  try {
    const result = await pool.query(
      'UPDATE feedback SET reply = $1 WHERE id = $2 RETURNING *',
      [reply, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Reply error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

