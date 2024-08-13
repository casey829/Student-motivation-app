import React from "react";
import styles from '../Homepage/style.css/StudentMotivation.module.css';
import SignUpButton from "./SignUpButton";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";


function StudentMotivation() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>STUDENT MOTIVATION</h1>
        <img 
          loading="lazy" 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/73474e0484463a56c2d25f48d5170ed7de5bca6a58656e8829028c93e8b71a39?apiKey=7a11f6dc58d64669b80496691087fffa&&apiKey=7a11f6dc58d64669b80496691087fffa" 
          className={styles.mainImage} 
          alt="Student motivation illustration"
        />
        <section className={styles.actionSection}>
          <p className={styles.motivationalText}>
            The secret to your future is hidden in your daily routine
          </p>
          <p className={styles.signUpText}>Sign Up</p>
          <SignUpButton>Student</SignUpButton>
          <SignUpButton className={styles.staffButton}>Staff</SignUpButton>
          <SignUpButton className={styles.loginButton}>Login</SignUpButton>
        </section>
      </div>
    </main>
  );
}

export default StudentMotivation;