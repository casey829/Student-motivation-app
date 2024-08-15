import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';
import StudentDashboard from './StudentDashboard';
import image from "../Components/image/back_to_school_illustration.jpeg";
const StudentMotivation = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    userType: ''
  });

  const navigate = useNavigate();

  const handleButtonClick = (type) => {
    setShowModal(true);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      userName: '',
      email: '',
      password: '',
      userType: ''
    });
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
    
    let url = '';
    let bodyData = {};
  
    if (modalType === 'signup') {
      url = 'http://127.0.0.1:5000/sign-up';
      bodyData = {
        username: formData.userName,
        email: formData.email,
        password: formData.password,
        userType: formData.userType.toLowerCase()
      };
    } else if (modalType === 'login') {
      url = 'http://127.0.0.1:5000/login';
      bodyData = {
        email: formData.email,
        password: formData.password
      };
    }
    //log the body data before sending it to the server
    console.log('Body Data:', JSON.stringify(bodyData));
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });
  
      // Log the response status and text for debugging
      console.log('Response Status:', response.status);
      const text = await response.text(); // Read response as text
      console.log('Response Text:', text);
  
      // Try to parse the response text
      const data = JSON.parse(text);
  
      if (response.ok) {
        alert(`${modalType === 'signup' ? 'Sign Up' : 'Login'} successful!`);
        if (modalType === 'login') {
          if (data.role === 'admin') {
            navigate('/admin-dashboard');
          } else if (data.role === 'staff') {
            navigate('/staff-dashboard');
          } else if (data.role === 'student') {
            navigate('/student-dashboard');
          }
        }
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      handleCloseModal();
    }
  };
  
  return (
    <div className="landing-page">
      <header className="headers">
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
            {modalType === 'signup' && (
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
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<StudentMotivation />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/staff-dashboard" element={<StaffDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
    </Routes>
  </Router>
);

export default App;
