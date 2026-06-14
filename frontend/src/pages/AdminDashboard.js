import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE, authHeaders, truncateText } from '../config/api';
import { logout as logoutUser } from '../utils/auth';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [membership, setMembership] = useState('normal');
  const [media, setMedia] = useState(null);
  const [existingMediaUrl, setExistingMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);

  const fileInputRef = useRef(null);
  const formSectionRef = useRef(null);
  const navigate = useNavigate();

  const fetchBlogs = async ({ showListLoader = false } = {}) => {
    if (showListLoader) setListLoading(true);
    try {
      const blogsRes = await axios.get(`${API_BASE}/api/blogs`, {
        headers: authHeaders(),
      });
      setPosts(blogsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch blog posts.');
    } finally {
      if (showListLoader) setListLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs({ showListLoader: true });
  }, []);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMedia(null);
    setExistingMediaUrl(null);
    setMediaType('image');
    setMembership('normal');
    setIsEditing(false);
    setEditPostId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setError('');
    setSuccess('');
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    if (!isEditing && !media) {
      setError('Please upload an image or video for new posts.');
      return;
    }

    if (media) {
      if (mediaType === 'image' && !media.type.startsWith('image/')) {
        setError('Selected file is not a valid image.');
        return;
      }
      if (mediaType === 'video' && !media.type.startsWith('video/')) {
        setError('Selected file is not a valid video.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('membership', membership);
    formData.append('media_type', mediaType);
    if (media) {
      formData.append('media', media);
    }

    setLoading(true);

    try {
      const headers = authHeaders();
      if (isEditing && editPostId != null) {
        await axios.put(`${API_BASE}/api/blogs/${editPostId}`, formData, { headers });
        setSuccess('Blog post updated successfully!');
      } else {
        await axios.post(`${API_BASE}/api/blogs`, formData, { headers });
        setSuccess('Blog post created successfully!');
      }

      resetForm();
      await fetchBlogs();
    } catch (err) {
      console.error('Error creating or updating blog:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save blog post.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (postId) => {
    const post = posts.find((p) => String(p.id) === String(postId));
    if (!post) {
      setError('Could not find that post to edit.');
      return;
    }

    setError('');
    setSuccess('');
    setTitle(post.title);
    setContent(post.content);
    setMembership(post.membership || 'normal');
    setMediaType(post.media_type || 'image');
    setExistingMediaUrl(post.media_url || null);
    setMedia(null);
    setIsEditing(true);
    setEditPostId(post.id);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLogout = () => logoutUser(navigate);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.delete(`${API_BASE}/api/blogs/${postId}`, {
        headers: authHeaders(),
      });

      if (String(editPostId) === String(postId)) {
        resetForm();
      }

      setSuccess('Blog post deleted successfully!');
      await fetchBlogs();
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError(err.response?.data?.message || 'Failed to delete blog post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <button type="button" className="btn-logout" onClick={handleLogout}>
          Log out
        </button>
      </header>

      {/* Blog Post Creation Form */}
      <section className="create-post-form" ref={formSectionRef}>
        <h3>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
        {isEditing && (
          <p className="edit-hint">
            Editing post #{editPostId}. Leave media empty to keep the current file, or upload a new one to replace it.
          </p>
        )}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handlePost} className="post-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <div className="form-selects">
            <select value={membership} onChange={(e) => setMembership(e.target.value)}>
              <option value="normal">Normal</option>
              <option value="premium">Premium</option>
              <option value="both">Both</option>
            </select>
            <select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          {isEditing && existingMediaUrl && !media && (
            <div className="current-media-preview">
              <p className="current-media-label">Current media:</p>
              {mediaType === 'image' ? (
                <img
                  src={`${API_BASE}${existingMediaUrl}`}
                  alt="Current post media"
                  className="blog-media"
                />
              ) : (
                <video controls className="blog-media">
                  <source src={`${API_BASE}${existingMediaUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          <label className="file-upload-label">
            {isEditing ? 'Replace media (optional)' : 'Upload media'}
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setMedia(e.target.files[0] || null)}
              accept={mediaType === 'image' ? 'image/*' : 'video/*'}
              required={!isEditing}
            />
          </label>

          {media && (
            <p className="file-selected">
              New file selected: <strong>{media.name}</strong>
            </p>
          )}

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading
                ? isEditing
                  ? 'Updating...'
                  : 'Creating...'
                : isEditing
                  ? 'Update Post'
                  : 'Create Post'}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn-cancel-edit"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Blog Posts List */}
      <section className="blog-list">
        <h3>All Blog Posts</h3>
        {listLoading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No blog posts available.</p>
        ) : (
          posts.map((post) => (
            <div
              className={`blog-card${
                isEditing && String(editPostId) === String(post.id)
                  ? ' blog-card--editing'
                  : ''
              }`}
              key={post.id}
            >
              <h4>{post.title}</h4>
              <p>{truncateText(post.content, 100)}</p>
              {post.media_url && post.media_type === 'image' && (
                <img
                  src={`${API_BASE}${post.media_url}`}
                  alt={post.title}
                  className="blog-media"
                />
              )}
              {post.media_url && post.media_type === 'video' && (
                <video controls className="blog-media">
                  <source src={`${API_BASE}${post.media_url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <div className="blog-card-actions">
                <button type="button" onClick={() => handleEdit(post.id)}>Edit</button>
                <button type="button" onClick={() => handleDelete(post.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* User Management Section */}
      <section className="user-management">
        <h3>User Management</h3>
        <button onClick={() => navigate('/admin/users')} className="manage-users-btn">
          Manage Users
        </button>
      </section>

      {/* Feedback Management Section */}
      <section className="feedback-management">
        <h3>Feedback Management</h3>
        <button onClick={() => navigate('/admin/feedback')} className="manage-feedback-btn">
          Manage Feedback
        </button>
      </section>
    </div>
  );
};

export default AdminDashboard;
