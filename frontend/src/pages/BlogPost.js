import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, authHeaders } from '../config/api';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE}/api/blogs/${id}`, {
          headers: authHeaders(),
        });
        setPost(res.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.response?.data?.message || 'Failed to load this post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p className="blog-feed">Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="blog-feed">
      <Link to="/blogs" className="read-more">
        ← Back to blogs
      </Link>
      <article className="blog-card">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
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
      </article>
    </div>
  );
};

export default BlogPost;
