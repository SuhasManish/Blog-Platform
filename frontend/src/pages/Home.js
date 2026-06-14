// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router

const Home = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h2>Welcome to My Blog Platform</h2>
        <p>Your go-to space for reading and sharing premium content.</p>
      </header>

      <section className="intro-section">
        <h3>Why Join?</h3>
        <ul>
          <li>🔓 Access exclusive blogs and media (for premium members)</li>
          <li>📸 Explore photo and video posts</li>
          <li>📩 Send feedback or doubts directly to the admin</li>
        </ul>
      </section>

      <div className="cta-buttons">
        <Link to="/register" className="btn register">
          <i className="fas fa-user-plus"></i> Register
        </Link>
        <Link to="/login" className="btn login">
          <i className="fas fa-sign-in-alt"></i> Login
        </Link>
        <Link to="/contact" className="btn contact">
          <i className="fas fa-envelope"></i> Contact Us
        </Link>
      </div>

      <footer className="home-footer">
        <p>Start your journey today with our amazing community!</p>
      </footer>
    </div>
  );
};

export default Home;