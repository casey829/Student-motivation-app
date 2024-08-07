import React from "react";


const StudentSignup = () => {
  return (
    <div className="signup-container">
      <h1>Student signup</h1>
      <form>
        <input type="text" placeholder="First name" />
        <input type="text" placeholder="Last name" />
        <input type="text" placeholder="Student ID" />
        <input type="email" placeholder="Email Address" />
        <input type="password" placeholder="Password" />
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default StudentSignup;
