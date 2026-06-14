import React, { useState } from 'react';
import { API_BASE } from '../config/api';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [response, setResponse] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse('');
    try {
      const res = await fetch(`${API_BASE}/api/feedback/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setResponse('Message sent successfully!');
        setForm({ name: '', email: '', message: '' });
      } else {
        setResponse('Failed to send message.');
      }
    } catch (err) {
      setResponse('Server error. Try again later.');
    }
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your Email" required />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" required />
        <button type="submit">Send</button>
      </form>
      <p>{response}</p>
    </div>
  );
};

export default ContactUs;
