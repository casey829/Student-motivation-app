import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from "react";
import './App.css'
import StudentMotivation from "../src/components/FrontEnd/Components/Homepage/StudentMotivation"
import StaffDashboard from './components/FrontEnd/Components/StaffDashboard';
import AdminDashboard from './components/FrontEnd/Components/AdminDashboard';
import StudentDashboard from './components/FrontEnd/Components/StudentDashboard';


function App() {
  return (

  <StudentMotivation/>
  
    
  );
}

export default App;
