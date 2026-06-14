export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const logout = (navigate) => {
  clearSession();
  navigate('/login');
};
