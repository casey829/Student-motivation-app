import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from "react";
import './App.css'
import StudentMotivation from "./FrontEnd/Components/Homepage/StudentMotivation";
import StudentDashboard from './FrontEnd/Components/Dashboard/StudentDashboard';

function App() {
  return (
    <>
    <StudentMotivation />
    <StudentDashboard />
    
   </>
  );
}

export default App;
