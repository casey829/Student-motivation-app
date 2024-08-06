import React from "react";
import { CiFlag1 } from "react-icons/ci";
import { FcApprove } from "react-icons/fc";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";

function StaffDashboard(){
return (
    <div>
      <div className="dashboard">
        <div className="logo"></div>
        <div className="dashboard">Dashboard</div>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="add-icon"><IoAddCircleOutline /></div>
          <div className="user-name">Marion</div>
        </div>
        <div className="content">
          <div className="video-section">
            <h2>Categorize Uploaded Videos</h2>
            <div className="actions">
            <button>Categorize <IoIosArrowDropdown /></button>
            <button>Approve <FcApprove /></button>
            <button>Flag <CiFlag1 /></button>
          </div>
          </div>
          <div className="audio-section">
            <h2>Categorize Uploaded Audios</h2>
            <div className="actions">
            <button>Categorize <IoIosArrowDropdown /></button>
            <button>Approve <FcApprove /></button>
            <button>Flag <CiFlag1 /></button> <button>Flag</button>
          </div>
          </div>
          <div className="article-section">
            <h2>Categorize Uploaded Articles</h2>
            <div className="actions">
            <button>Categorize <IoIosArrowDropdown /></button>
            <button>Approve <FcApprove /></button>
            <button>Flag <CiFlag1 /></button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
