import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function LoginForm() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password }),
    });

    const result = await response.json();
    if (response.ok) {
      // Redirect based on user role
      if (result.role === 'student') {
        navigate('/student-dashboard'); // Navigate to student dashboard
      } else if (result.role === 'staff') {
        navigate('/staff-dashboard'); // Navigate to staff dashboard
      }
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
