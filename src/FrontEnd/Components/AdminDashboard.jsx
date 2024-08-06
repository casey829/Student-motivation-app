import React from "react";
import { CiFlag1 } from "react-icons/ci";
import { FcApprove } from "react-icons/fc";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";


function AdminDashboard(){
return (
    <div className="dashboard">
    <div className="header">
      <div className="header-right">
      <div className="add-icon"><IoAddCircleOutline /></div>
   <IoAddCircleOutline />
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
      
      <div className="content">
          <div className="video-section">
            <h2>Categorize Uploaded Videos</h2>
            <div className="actions">
              <div><CiVideoOn /></div>
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
            <button>Flag <CiFlag1 /></button>
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

export default AdminDashboard;


