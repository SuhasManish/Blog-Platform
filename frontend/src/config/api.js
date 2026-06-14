/**
 * API base URL
 * - Development: http://localhost:5000 (or REACT_APP_API_URL from .env)
 * - Production single-server: empty string → same-origin /api
 * - Production split: set REACT_APP_API_URL to your API host
 */
export const API_BASE =
  process.env.REACT_APP_API_URL !== undefined
    ? process.env.REACT_APP_API_URL
    : process.env.NODE_ENV === 'production'
      ? ''
      : 'http://localhost:5000';

export const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const truncateText = (text, max = 100) => {
  if (!text) return '';
  return text.length <= max ? text : `${text.slice(0, max)}...`;
};
