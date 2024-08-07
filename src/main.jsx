import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import StudentMotivation from './FrontEnd/Components/Homepage/StudentMotivation.jsx'

import StaffDashboard from './FrontEnd/Components/StaffDashboard';
import AdminDashboard from './FrontEnd/Components/AdminDashboard';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StudentMotivation/>
   
  </React.StrictMode>,
)
