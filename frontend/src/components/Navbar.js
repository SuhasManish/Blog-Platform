import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth(); // Get auth data and logout function from context

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">Blog Platform</Link>
        <ul className="nav-links">
          {user ? (
            <>
              <li><span>{user.name}</span></li>
              <li><button onClick={logout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-link">Login</Link></li>
              <li><Link to="/register" className="nav-link">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
