import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { API_BASE, authHeaders, truncateText } from '../config/api';
import { logout as logoutUser } from '../utils/auth';

const canViewPost = (post, userRole) => {
  if (!post) return false;
  if (userRole === 'admin') return true;
  if (post.membership === 'both') return true;
  if (post.membership === 'normal') return true;
  if (post.membership === 'premium') return userRole === 'premium';
  return true;
};

const BlogFeed = () => {
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userRole, setUserRole] = useState('normal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role || 'normal');
    } catch {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const fetchBlogs = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE}/api/blogs`, {
          headers: authHeaders(),
        });
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.response?.data?.message || 'Failed to load blog posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [navigate]);

  const visiblePosts = posts.filter((post) => canViewPost(post, userRole));

  const handleLogout = () => logoutUser(navigate);

  const roleLabel =
    userRole === 'premium' ? 'Premium member' : userRole === 'admin' ? 'Admin' : 'Member';

  return (
    <div className="blog-feed">
      <header className="dashboard-header user-dashboard-header">
        <div>
          <h2 className="dashboard-title">My Blog Feed</h2>
          <p className="user-dashboard-subtitle">{roleLabel}</p>
        </div>
        <button type="button" className="btn-logout" onClick={handleLogout}>
          Log out
        </button>
      </header>

      {loading && <p>Loading posts...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && visiblePosts.length === 0 && (
        <p>No posts available for your membership level.</p>
      )}

      {visiblePosts.map((post) => (
        <div className="blog-card" key={post.id}>
          <h3>{post.title}</h3>
          <p>{truncateText(post.content, 100)}</p>

          {post.media_url && post.media_type === 'image' && (
            <img
              src={`${API_BASE}${post.media_url}`}
              alt={post.title}
              className="blog-media"
              onClick={() => setSelectedImage(`${API_BASE}${post.media_url}`)}
            />
          )}

          {post.media_url && post.media_type === 'video' && (
            <video controls className="blog-media">
              <source src={`${API_BASE}${post.media_url}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <Link to={`/post/${post.id}`} className="read-more">
            Read more
          </Link>
        </div>
      ))}

      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)} role="presentation">
          <img src={selectedImage} alt="Full view" className="modal-image" />
        </div>
      )}
    </div>
  );
};

export default BlogFeed;
