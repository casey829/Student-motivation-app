import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import StaffDashboard from './FrontEnd/Components/StaffDashboard.jsx'
import AdminDashboard from './FrontEnd/Components/AdminDashboard.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminDashboard/>
    <StaffDashboard/>
  </React.StrictMode>,
)
