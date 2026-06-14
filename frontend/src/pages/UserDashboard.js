import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function UserDashboard() {
  const { user } = useAuth(); // Get user data from auth context
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user) {
      // Fetch posts authored by the logged-in user (replace with your actual API endpoint)
      axios.get(`/api/posts/user/${user.id}`)
        .then(response => {
          setPosts(response.data);
        })
        .catch(error => console.log(error));
    }
  }, [user]);

  return (
    <div className="user-dashboard">
      <h2>User Dashboard</h2>
      <div className="posts-list">
        <h3>Your Posts</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <Link to={`/view-post/${post.id}`} className="btn">View</Link>
                  <Link to={`/edit/${post.id}`} className="btn">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/create-post" className="btn create-post-btn">Create New Post</Link>
      </div>
    </div>
  );
}

export default UserDashboard;
