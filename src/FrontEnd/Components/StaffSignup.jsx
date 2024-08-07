import React from "react";


const StaffSignup = () => {
  return (
    <div className="signup-container">
      <h1>Staff SignUp</h1>
      <form>
        <input type="text" placeholder="First name" />
        <input type="text" placeholder="Last name" />
        <input type="text" placeholder="Staff Position" />
        <input type="text" placeholder="Staff ID" />
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

export default StaffSignup;
