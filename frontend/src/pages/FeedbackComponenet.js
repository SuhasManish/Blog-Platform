import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE, authHeaders } from '../config/api';

const FeedbackManagement = () => {
  const [feedback, setFeedback] = useState([]);
  const [replies, setReplies] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFeedback = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE}/api/feedback/all`, {
        headers: authHeaders(),
      });
      const items = Array.isArray(response.data?.data) ? response.data.data : [];
      setFeedback(items);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError(err.response?.data?.message || 'Failed to fetch feedback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleReplyChange = (id, value) => {
    setReplies((prev) => ({ ...prev, [id]: value }));
  };

  const handleReply = async (id) => {
    const replyText = (replies[id] || '').trim();
    if (!replyText) {
      setError('Please enter a reply before sending.');
      return;
    }

    setError('');
    try {
      await axios.put(
        `${API_BASE}/api/feedback/reply/${id}`,
        { reply: replyText },
        { headers: authHeaders() }
      );
      setReplies((prev) => ({ ...prev, [id]: '' }));
      await fetchFeedback();
    } catch (err) {
      console.error('Error replying to feedback:', err);
      setError(err.response?.data?.message || 'Failed to send reply.');
    }
  };

  return (
    <div className="feedback-management">
      <h2>Feedback Management</h2>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading feedback...</p>
      ) : feedback.length === 0 ? (
        <p>No feedback available.</p>
      ) : (
        feedback.map((item) => (
          <div key={item.id} className="feedback-item">
            <p><strong>User Name:</strong> {item.name}</p>
            <p><strong>User Email:</strong> {item.email}</p>
            <p><strong>Feedback:</strong> {item.message}</p>
            <textarea
              placeholder="Write your reply..."
              value={replies[item.id] || ''}
              onChange={(e) => handleReplyChange(item.id, e.target.value)}
            />
            <button type="button" onClick={() => handleReply(item.id)}>
              Send Reply
            </button>
            <p><strong>Admin Reply:</strong> {item.reply || 'No reply yet'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default FeedbackManagement;
