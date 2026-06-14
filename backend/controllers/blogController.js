
const pool = require('../db');  // Import the PostgreSQL pool
const path = require('path');   // To handle file paths
const fs = require('fs'); // To check if file path exists

// Create new blog post
exports.createBlog = async (req, res) => {
  try {
    // Extract data from the request body
    const { title, content, media_type, membership } = req.body;

    // Ensure that required fields are provided
    if (!title || !content || !media_type || !membership) {
      return res.status(400).json({ message: 'All fields (title, content, media_type, membership) are required!' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required for new blog posts.' });
    }

    const media_url = `/uploads/${req.file.filename}`;

    // Extract user_id from the decoded token (from verifyToken middleware)
    const user_id = req.user.userId;  // Ensure user_id is safely extracted from req.user
    
    // Check if user_id is available (ensuring the user is logged in)
    if (!user_id) {
      return res.status(400).json({ message: 'User ID not found. Please log in.' });
    }

    // Validate membership value (optional)
    const validMemberships = ['normal', 'premium', 'both'];
    if (!validMemberships.includes(membership)) {
      return res.status(400).json({ message: 'Invalid membership value. Valid options: "normal", "premium", "both".' });
    }

    // Insert the new blog into the database
    const result = await pool.query(
      'INSERT INTO blogs (title, content, media_url, media_type, membership, user_id, created_at) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
      [title, content, media_url, media_type, membership, user_id]
    );

    const newBlog = result.rows[0];
    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    // If an error occurs during insertion, log and respond with a server error
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog. Please try again later.' });
  }
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, media_type, membership } = req.body;
  const user_id = req.user.userId;

  try {
    // Validate required text fields (file upload is optional)
    if (!title || !content || !media_type || !membership) {
      return res.status(400).json({ message: 'All fields (title, content, media_type, membership) are required!' });
    }

    // Fetch blog post to check existence and ownership
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    const blog = result.rows[0];

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Authorization check (coerce IDs — JWT/DB types may differ)
    const isOwner = Number(user_id) === Number(blog.user_id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to edit this blog post' });
    }

    // Use existing media_url if no new file is uploaded
    const media_url = req.file ? `/uploads/${req.file.filename}` : blog.media_url;

    // Update blog in DB
    const updateResult = await pool.query(
      'UPDATE blogs SET title = $1, content = $2, media_url = $3, media_type = $4, membership = $5 WHERE id = $6 RETURNING *',
      [title, content, media_url, media_type, membership, id]
    );

    const updatedBlog = updateResult.rows[0];
    res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog. Please try again later.' });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    // Handle any errors while fetching blogs
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs. Please try again later.' });
  }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
  const { id } = req.params;  // Extract blog ID from the URL params
  try {
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    const blog = result.rows[0];

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    // Handle any errors while fetching the blog
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog. Please try again later.' });
  }
};
// Delete a blog post
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;  // Extract blog ID from the URL
  const user_id = req.user.userId;  // Extract user_id from the decoded token
  
  try {
    // Fetch the blog post by ID to check if the post exists
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    const blog = result.rows[0];

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if the logged-in user is the admin or the author of the blog post
    const isOwner = Number(user_id) === Number(blog.user_id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to delete this blog post' });
    }

    // Delete the blog post from the database
    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog. Please try again later.' });
  }
};
