import React, { useState } from "react";
import styles from '../style.css/StudentMotivation.module.css';
import ActionButton from './ActionButton';
import StudentForm from './StudentForm';
import StaffSignup from "./StaffSignup";
import AdminLogin from './AdminLogin';

function StudentMotivation() {
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showStaffSignup, setShowStaffSignup] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>MOTIVATEU</h1>
        <div className={styles.iframeContainer}>
          <iframe
            src="https://assets.pinterest.com/ext/embed.html?id=16255248649137682"
            height="776"
            width="450"
            frameBorder="0"
            scrolling="no"
            title="Pinterest Embed"
            className={styles.iframe}
          ></iframe>
        </div>
        <section className={styles.actionSection}>
          <p className={styles.motivationalText}>
            The secret to your future is hidden in your daily routine
          </p>
          <p className={styles.signUpText}>Sign up</p>
          <ActionButton text="Student" onClick={() => setShowStudentForm(true)} />
          <ActionButton text="Staff" onClick={() => setShowStaffSignup(true)} />
          <ActionButton text="login" className={styles.loginButton} onClick={() => setShowAdminLogin(true)} />
        </section>
      </div>
      {showStudentForm && <StudentForm onClose={() => setShowStudentForm(false)} />}
      {showStaffSignup && <StaffSignup onClose={() => setShowStaffSignup(false)} />}
      {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}
    </main>
  );
}

export default StudentMotivation;
