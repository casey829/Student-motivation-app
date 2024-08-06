import React from "react";
import { CiFlag1 } from "react-icons/ci";
import { FcApprove } from "react-icons/fc";
import { IoIosArrowDropdown ,  IoIosLogOut} from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";


function AdminDashboard(){
return (
    <div className="dashboard-container">
       <div className="add-icon-container">
      <div className="add-icon"><IoAddCircleOutline /></div>
      </div>
    <div className="header">
      <div className="header-right">
       
        <p className="user-name">Casey</p>
        <i className="logout-icon"><IoIosLogOut /></i>
      </div>
    </div>
    <div className="main-content">
      <div className="user-management-container">
        <div className="user-section">
        <h2 >Add a User</h2>
        <div className="buttons">
          <button className="user-btn">Staff</button>
          <button className="user-btn">Student</button>
        </div>
        
        </div>
        </div>
        <div  className="user-management-container">
          <div className="user-section">
        <h2 >Deactivate User</h2>
        <div className="buttons">
          <button className="user-btn">Staff</button>
          <button className="user-btn">Student</button>
          </div>
          </div>
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

export default AdminDashboard;


