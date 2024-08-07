import React from 'react';
import styles from '../style.css/StudentMotivation.module.css';

const SignUpButton = ({ children, className, ...props }) => {
  return (
    <button className={`${styles.actionButton} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default SignUpButton;