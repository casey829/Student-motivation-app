import React from "react";


function AdminDashboard(){
return (
    <div className="dashboard">
    <div className="header">
      <div className="header-right">
        <p className="user-name">Casey</p>
        <i className="logout-icon"></i>
      </div>
    </div>
    <div className="main-content">
      <div className="user-actions">
        <button className="main-button">Add a User</button>
        <div className="sub-buttons">
          <button>Staff</button>
          <button>Student</button>
        </div>
        <button className="main-button">Deactivate User</button>
        <div className="sub-buttons">
          <button>Staff</button>
          <button>Student</button>
        </div>
      </div>
      <div className="mains-content">
        <div className="video-section">
          <i className="video-icon"></i>
          <div className="actions">
            <button>Categorize</button>
            <button>Approve</button>
            <button>Flag</button>
          </div>
        </div>
        <div className="audio-section">
          <i className="audio-icon"></i>
          <div className="actions">
            <button>Categorize</button>
            <button>Approve</button>
            <button>Flag</button>
          </div>
        </div>
        <div className="article-section">
          <i className="article-icon"></i>
          <div className="actions">
            <button>Categorize</button>
            <button>Approve</button>
            <button>Flag</button>
          </div>
        </div>
      </div>
    </div>
  </div>
); 

}

export default AdminDashboard;


