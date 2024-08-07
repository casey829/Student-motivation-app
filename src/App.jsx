
import React from "react";
import './App.css'
import StudentSignup from "./FrontEnd/Components/StudentSignup.jsx";
import StaffSignup from "./FrontEnd/Components/StaffSignup.jsx";
import StaffDashboard from './FrontEnd/Components/StaffDashboard';
import AdminDashboard from './FrontEnd/Components/AdminDashboard';

function App() {
  return (
    <div className="App">
       <StaffDashboard/>
      <AdminDashboard/>
      <StudentSignup /> 
  
    </div>
  );
}

