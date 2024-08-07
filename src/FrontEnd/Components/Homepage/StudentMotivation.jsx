/*import React, { useState } from "react";
import styles from './style.css/StudentMotivation.module.css';
import ActionButton from './ActionButton';
import StudentForm from './StudentForm';

function StudentMotivation() {
  const [showStudentForm, setShowStudentForm] = useState(false);

  const handleStudentClick = () => {
    setShowStudentForm(true);
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>STUDENT MOTIVATION</h1>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/73474e0484463a56c2d25f48d5170ed7de5bca6a58656e8829028c93e8b71a39?apiKey=7a11f6dc58d64669b80496691087fffa&&apiKey=7a11f6dc58d64669b80496691087fffa" className={styles.mainImage} alt="Student motivation illustration" />
        <section className={styles.actionSection}>
          <p className={styles.motivationalText}>
            The secret to your future is hidden in your daily routine
          </p>
          <p className={styles.signUpText}>Sign up</p>
          {!showStudentForm ? (
            <>
              <ActionButton text="Student" onClick={handleStudentClick} />
              <ActionButton text="Staff" />
              <ActionButton text="Login" className={styles.loginButton} />
            </>
          ) : (
            <StudentForm />
          )}
        </section>
      </div>
    </main>
  );
}

export default StudentMotivation;*/
/*import React, { useState } from "react";
import styles from './style.css/StudentMotivation.module.css';
import ActionButton from './ActionButton';
import StudentForm from './StudentForm';

function StudentMotivation() {
  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleStudentClick = () => {
    setShowForm(true);
    setIsLogin(false);
  };

  const handleLoginClick = () => {
    setShowForm(true);
    setIsLogin(true);
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    setShowForm(false);
  };

  const handleFormToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>STUDENT MOTIVATION</h1>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/73474e0484463a56c2d25f48d5170ed7de5bca6a58656e8829028c93e8b71a39?apiKey=7a11f6dc58d64669b80496691087fffa&&apiKey=7a11f6dc58d64669b80496691087fffa" className={styles.mainImage} alt="Student motivation visual representation" />
        <section className={styles.actionSection}>
          <p className={styles.motivationalText}>
            The secret to your future is hidden in your daily routine
          </p>
          {!showForm && (
            <>
              <p className={styles.signUpText}>Sign up</p>
              <ActionButton text="Student" onClick={handleStudentClick} />
              <ActionButton text="Staff" />
              <ActionButton text="Login" className={styles.loginButton} onClick={handleLoginClick} />
            </>
          )}
          {showForm && (
            <StudentForm
              isLogin={isLogin}
              onSubmit={handleFormSubmit}
              onToggle={handleFormToggle}
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default StudentMotivation;*/
import React, { useState } from "react";
import styles from './style.css/StudentMotivation.module.css';
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
        <h1 className={styles.title}>STUDENT MOTIVATION</h1>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/73474e0484463a56c2d25f48d5170ed7de5bca6a58656e8829028c93e8b71a39?apiKey=7a11f6dc58d64669b80496691087fffa&&apiKey=7a11f6dc58d64669b80496691087fffa" className={styles.mainImage} alt="Student motivation visual representation" />
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