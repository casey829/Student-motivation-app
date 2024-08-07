import React, { useState } from "react";
import { CiFlag1, CiVideoOn } from "react-icons/ci";
import { FcApprove } from "react-icons/fc";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";

const AdminDashboard = () => {
  const [categories, setCategories] = useState([
    { name: "DevOps", type: "Videos" },
    { name: "Fullstack", type: "Audios" },
    { name: "Front-End", type: "Articles" }
  ]);

  const handleFlag = (type) => {
    console.log(`Flagging ${type} content`);
    // Implement flagging logic here
  };

  const handleApprove = (type) => {
    console.log(`Approving ${type} content`);
    // Implement approval logic here
  };

  const handleCreateCategory = (name, type) => {
    setCategories([...categories, { name, type }]);
    console.log(`Creating category: ${name} for ${type}`);
  };

  return (
    <div className="dashboard">
      <div className="header">
        <div className="header-right">
          <div className="add-icon"><IoAddCircleOutline /></div>
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
          {["Videos", "Audios", "Articles"].map((type) => (
            <div key={type.toLowerCase()} className={`${type.toLowerCase()}-section`}>
              <h2>Categorize Uploaded {type}</h2>
              <div className="actions">
                <div><CiVideoOn /></div>
                <button onClick={() => handleCreateCategory("New Category", type)}>Categorize <IoIosArrowDropdown /></button>
                <button onClick={() => handleApprove(type)}>Approve <FcApprove /></button>
                <button onClick={() => handleFlag(type)}>Flag <CiFlag1 /></button>
              </div>
            </div>
          ))}
          <div className="categories-section">
            <h2>Categories</h2>
            <ul>
              {categories.map((category, index) => (
                <li key={index}>{category.name} ({category.type})</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
