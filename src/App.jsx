import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from "react";
import './App.css'
import StudentMotivation from "./FrontEnd/Components/Homepage/StudentMotivation";
import StaffDashboard from "../src/FrontEnd/Components/StaffDashboard"
import AdminDashboard from './FrontEnd/Components/AdminDashboard';
import StudentDashboard from './FrontEnd/Components/StudentDashboard';


function App() {
  return (

  <StudentMotivation/>
  
    
  );
}

export default App;
