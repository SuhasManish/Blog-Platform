import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/api';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_BASE}/api/auth/register`, {
        username: userData.name.trim(),
        email: userData.email.trim(),
        password: userData.password,
        role: 'normal',
      });

      setMessage('Registration successful! You can log in now.');
      setUserData({ name: '', email: '', password: '' });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Registration failed. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card--register">
        <div className="auth-header">
          <h2>Create account</h2>
          <p>Join the blog platform to read posts and share feedback</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form" noValidate>
          <div className="auth-field">
            <label className="auth-field-label" htmlFor="register-username">
              Username
            </label>
            <div className="input-group">
              <input
                id="register-username"
                type="text"
                name="name"
                placeholder="Choose a username"
                value={userData.name}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-field-label" htmlFor="register-email">
              Email
            </label>
            <div className="input-group">
              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={userData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-field-label" htmlFor="register-password">
              Password
            </label>
            <div className="input-group">
              <input
                id="register-password"
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={userData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>
            <span className="auth-field-hint">Minimum 6 characters</span>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
