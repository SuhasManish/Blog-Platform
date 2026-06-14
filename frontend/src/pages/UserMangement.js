import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE, authHeaders } from '../config/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/admin/users`, {
          headers: authHeaders(),
        });
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    if (currentRole === 'admin') {
      setError('Admin role cannot be changed from this toggle.');
      return;
    }
    const newRole = currentRole === 'premium' ? 'normal' : 'premium';
    try {
      await axios.put(
        `${API_BASE}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: authHeaders() }
      );
      const res = await axios.get(`${API_BASE}/api/admin/users`, {
        headers: authHeaders(),
      });
      setUsers(res.data);
      setError('');
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  return (
    <div className="user-management">
      <h3>User Management</h3>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="user-list">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <p>{user.email}</p>
              <p className="role-label">
                Role: <strong>{user.role}</strong>
              </p>
              {user.role !== 'admin' ? (
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={user.role === 'premium'}
                    onChange={() => handleToggleRole(user.id, user.role)}
                  />
                  <span className="slider round"></span>
                </label>
              ) : (
                <span className="role-label">Protected</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
