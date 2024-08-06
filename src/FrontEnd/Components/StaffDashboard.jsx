import React from "react";
import { CiFlag1 } from "react-icons/ci";
import { FcApprove } from "react-icons/fc";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";

function StaffDashboard(){
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo"></div>
        <div className="dashboard-text">Dashboard</div>
      </div>
<div className="add-icon-container"><div className="add-icon"><IoAddCircleOutline /></div>
</div>
      <div className="main-content">
        <div className="header">
          <div className="user-name">Casey</div>
        </div>
        <div className="content">
      <div className="center-text"><h2>Categorize Uploaded Videos</h2></div>

          <div className="section">
         
            <ul className="actions">
            <li><button className="categorize-btn">Categorize <IoIosArrowDropdown /></button></li>
      <li><button className="approve-btn">Approve <FcApprove /></button></li>
      <li><button className="flag-btn">Flag <CiFlag1 /></button></li>
          </ul>
          </div>
          <div className="center-text"> <h2>Categorize Uploaded Audios</h2></div>
          <div className="section">
        
            <ul className="actions">
            <li><button className="categorize-btn">Categorize <IoIosArrowDropdown /></button></li>
      <li><button className="approve-btn">Approve <FcApprove /></button></li>
      <li><button className="flag-btn">Flag <CiFlag1 /></button></li>
          </ul>
          </div>
          

          <div className="center-text"> <h2>Categorize Uploaded Articles</h2> </div>
          <div className="section">
            <ul className="actions">
            <li><button className="categorize-btn">Categorize <IoIosArrowDropdown /></button></li>
      <li><button className="approve-btn">Approve <FcApprove /></button></li>
      <li><button className="flag-btn">Flag <CiFlag1 /></button></li>
          </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
