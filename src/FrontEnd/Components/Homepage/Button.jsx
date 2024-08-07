import React from 'react';
import styles from '../style.css/StudentMotivation.module.css';

const Button = ({ text, className, onClick }) => {
  return (
    <button className={`${styles.actionButton} ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;

