// models/Post.js
const pool = require('../db');

const createPost = async (userId, title, content, media, visibility) => {
  const result = await pool.query(
    `INSERT INTO posts (user_id, title, content, media, visibility) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, title, content, media, visibility]
  );
  return result.rows[0];
};

const getPostsByVisibility = async (visibility) => {
  const result = await pool.query('SELECT * FROM posts WHERE visibility = $1', [visibility]);
  return result.rows;
};

module.exports = { createPost, getPostsByVisibility };
