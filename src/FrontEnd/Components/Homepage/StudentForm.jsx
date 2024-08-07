
/*import React, { useState } from 'react';
import styles from '../style.css/Form.module.css';

const StudentForm = ({ onClose }) => {
  const [hasAccount, setHasAccount] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
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
        <h2>{hasAccount ? 'Student Login' : 'Student Sign Up'}</h2>
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
                name="studentId"
                placeholder="Student ID"
                value={formData.studentId}
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

export default StudentForm;*/
import React, { useState } from 'react';
import styles from '../style.css/Form.module.css';
import Button from './Button';

const StudentForm = ({ onLogin }) => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className={styles.formContainer}>
      <h2>{isNewUser ? 'Student Sign Up' : 'Student Login'}</h2>
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
        {isNewUser && (
          <>
            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              value={formData.studentId}
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
        <Button type="submit">{isNewUser ? 'Sign Up' : 'Login'}</Button>
      </form>
      <p onClick={() => setIsNewUser(!isNewUser)}>
        {isNewUser ? 'Already have an account? Login' : 'Need an account? Sign Up'}
      </p>
    </div>
  );
};

export default StudentForm;