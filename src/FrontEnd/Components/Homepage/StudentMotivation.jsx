import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styles from '../Homepage/StudentMotivation.module.css'; // Corrected the path
import SignUpButton from "./SignUpButton";
import AdminDashboard from "./AdminDashboard"; // Ensure you have this component

function StudentMotivation() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: ''
  });

  const handleButtonClick = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUserType('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  const handleRoleSelect = (role) => {
    setUserType(role);
  };

  return (
    <div className={styles.landingPage}>
      <header className={styles.headers}>
        <div className={styles.logo}>TeckStudy</div>
        <nav className={styles.navigation}>
          <a href="#" onClick={() => handleButtonClick('admin')}>Admin</a>
          <a href="#">About Us</a>
          <button onClick={() => handleButtonClick('signup')}>SignUp</button>
          <button onClick={() => handleButtonClick('login')}>LogIn</button>
        </nav>
        <div className={styles.menuIcon}>&#9776;</div>
      </header>

      <section className={styles.mainContents}>
        <div className={styles.imageContainer}>
          <img src={image} alt="Coworking Illustration" />
        </div>
        <div className={styles.textContent}>
          <h1>You Can Do This</h1>
          <p>
            <strong>About Us:</strong> Welcome to TeckStudy—your portal to the world of technology...
          </p>
          <h2>The secret to your future is hidden in your daily routine.</h2>
        </div>
      </section>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={handleCloseModal}>
              &times;
            </span>
            {modalType === 'admin' ? (
              <form onSubmit={handleSubmit}>
                <h3>Admin Login</h3>
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
                <button type="submit">Login</button>
              </form>
            ) : userType ? (
              <form onSubmit={handleSubmit}>
                <h3>Sign Up as {userType}</h3>
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
                  placeholder="Email Address"
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
            ) : (
              <>
                <h3>Select Your Role ({modalType})</h3>
                <button onClick={() => handleRoleSelect('Staff')}>Staff</button>
                <button onClick={() => handleRoleSelect('Student')}>Student</button>
              </>
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
    </Routes>
  </Router>
);

export default App;
