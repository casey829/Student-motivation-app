import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from "../Components/image/back_to_school_illustration.jpeg";

const API_BASE_URL = 'http://127.0.0.1:5000';
const SIGN_UP_URL = `${API_BASE_URL}/sign-up`;
const LOGIN_URL = `${API_BASE_URL}/login`;
const CONFIRM_EMAIL_URL = `${API_BASE_URL}/confirm-email`;

const StudentMotivation = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    userType: '',
    token: ''
  });

  const [showTokenForm, setShowTokenForm] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = (type) => {
    setShowModal(true);
    setModalType(type);
    if (type === 'signup') setShowTokenForm(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      userName: '',
      email: '',
      password: '',
      userType: '',
      token: ''
    });
    setShowTokenForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = modalType === 'signup' ? SIGN_UP_URL : LOGIN_URL;
    const bodyData = modalType === 'signup'
      ? {
          username: formData.userName,
          email: formData.email,
          password: formData.password,
          userType: formData.userType.toLowerCase()
        }
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (response.ok) {
        if (modalType === 'signup') {
          alert('Sign Up successful! Please check your email to confirm your account.');
          setShowTokenForm(true);
        } else {
          localStorage.setItem('access_token', data.access_token); // Store token
          alert('Login successful!');
          fetchData();
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(CONFIRM_EMAIL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: formData.token })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token); // Store token
        alert('Email confirmed and logged in successfully!');
        fetchData();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://127.0.0.1:5000/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      navigate(`${data.role}-dashboard`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">TeckStudy</div>
        <nav className="navigation">
          <a href="#" onClick={() => handleButtonClick('login')}>Admin</a>
          <a href="#">About Us</a>
          <button onClick={() => handleButtonClick('signup')}>Sign Up</button>
          <button onClick={() => handleButtonClick('login')}>Log In</button>
        </nav>
        <div className="menu-icon">&#9776;</div>
      </header>

      <section className="main-contents">
        <div className="image-container">
          <img src={image} alt="Coworking Illustration" />
        </div>
        <div className="text-content">
          <h1>You Can Do This</h1>
          <p>
            <strong>About Us:</strong> Welcome to TeckStudy—your portal to the world of technology.
            Our mission at TeckStudy is to provide students with reliable and inspiring resources, connecting them directly to the pulse of the tech industry.
            <br />
            <strong>What We Offer:</strong>
            Exclusive Interviews: Engage with tech industry leaders, Moringa school alumni, and our expert staff through insightful video and audio interviews.
            Engaging Articles: Stay informed with articles that demystify tech concepts, cover the latest trends, and offer career advice.
            Diverse Multimedia Content: Choose from videos, podcasts, or detailed articles to match your preferred learning style.
            Join Our Community: Enhance your tech knowledge and network with us. Every piece of content is designed to broaden your understanding and connect you with the tech world.
            Explore TeckStudy today and discover your tech potential tomorrow
          </p>
          <h2>The secret to your future is hidden in your daily routine.</h2>
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>
              &times;
            </span>
            {modalType === 'signup' && !showTokenForm && (
              <form onSubmit={handleSubmit}>
                <h3>Sign Up</h3>
                <input
                  type="text"
                  name="userName"
                  placeholder="User Name"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="userType"
                  placeholder="staff or student"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                />
                <button type="submit">Submit</button>
              </form>
            )}
            {modalType === 'login' && (
              <form onSubmit={handleSubmit}>
                <h3>Login</h3>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="submit">Submit</button>
              </form>
            )}
            {showTokenForm && (
              <form onSubmit={handleTokenSubmit}>
                <h3>Confirm Email</h3>
                <input
                  type="text"
                  name="token"
                  placeholder="Enter the token from your email"
                  value={formData.token}
                  onChange={handleChange}
                  required
                />
                <button type="submit">Confirm</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMotivation;
