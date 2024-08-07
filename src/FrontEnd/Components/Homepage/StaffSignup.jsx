
import React, { useState } from 'react';
import styles from './style.css/Form.module.css';

const StaffSignup = ({ onClose }) => {
  const [hasAccount, setHasAccount] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    staffId: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onClose();
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h2>{hasAccount ? 'Staff Login' : 'Staff Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {!hasAccount && (
            <>
              <input
                type="text"
                name="staffId"
                placeholder="Staff ID"
                value={formData.staffId}
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
            </>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{hasAccount ? 'Login' : 'Sign Up'}</button>
        </form>
        <p>
          {hasAccount ? "Don't have an account? " : "Already have an account? "}

          <button onClick={() => setHasAccount(!hasAccount)}>
            {hasAccount ? 'Sign Up' : 'Login'}
          </button>
        </p>
       
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default StaffSignup;
