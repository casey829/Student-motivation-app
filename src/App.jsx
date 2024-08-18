import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import StudentMotivation from './FrontEnd/Components/StudentMotivation';
import StaffDashboard from './FrontEnd/Components/StaffDashboard';
import AdminDashboard from './FrontEnd/Components/AdminDashboard';
import StudentDashboard from './FrontEnd/Components/StudentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentMotivation />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
