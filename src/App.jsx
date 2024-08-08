import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from "react";
import './App.css';
import StudentMotivation from './FrontEnd/Components/Homepage/StudentMotivation';
import StaffForm from './FrontEnd/Components/Homepage/StaffSignup';
import SignUpButton from './FrontEnd/Components/Homepage/SignUpButton';
import StudentForm from './FrontEnd/Components/Homepage/StudentForm';
import AdminLogin from './FrontEnd/Components/Homepage/AdminLogin';
import AdminDashboard from './FrontEnd/Components/AdminDashboard';
import StaffDashboard from './FrontEnd/Components/StaffDashboard'
function App() {
  return (
    <div>
      <AdminDashboard/>
      <StaffDashboard/>
      <StudentMotivation/>
    </div>

  );
}

export default App;
// 