import React from "react";

function StaffDashboard(){
return (
    <div>
      <div className="dashboard">
        <div className="logo"></div>
        <div className="dashboard">Dashboard</div>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="add-icon">+</div>
          <div className="user-name">Marion</div>
        </div>
        <div className="content">
          <div className="video-section">
            <h2>Categorize Uploaded Videos</h2>
          </div>
          <div className="audio-section">
            <h2>Categorize Uploaded Audios</h2>
          </div>
          <div className="article-section">
            <h2>Categorize Uploaded Articles</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
