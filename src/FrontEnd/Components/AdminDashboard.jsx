import React, { useState, useRef } from "react";
import { CiFlag1, CiUser } from "react-icons/ci";
import { FcApprove } from "react-icons/fc";
import { IoIosArrowDropdown, IoIosLogOut } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { TiUserAdd } from "react-icons/ti";
import { HiOutlineUserRemove } from "react-icons/hi";
import { MdOutlineSpaceDashboard } from "react-icons/md";

function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'addUser', 'deactivateUser', 'addContent'
  const [userType, setUserType] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [contentType, setContentType] = useState(""); // 'Video', 'Audio', 'Article'
  const [contentData, setContentData] = useState({
    title: "",
    description: "",
    link: "",
    thumbnail: "" // Added field for thumbnail
  });
  const [contentList, setContentList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Added state for category
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Replace with actual authentication logic
  const [role, setRole] = useState('Admin'); // Default role, change based on login

  const addUserRef = useRef(null);
  const deactivateUserRef = useRef(null);

  const handleOpenModal = (type, ref) => {
    setModalType(type);
    setIsModalOpen(true);
    if (ref.current) {
      ref.current.focus();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setUserType("");
    setUserName("");
    setUserId("");
    setContentType("");
    setContentData({
      title: "",
      description: "",
      link: "",
      thumbnail: ""
    });
    setSelectedCategory(""); 
  };

  const handleUserTypeChange = (e) => setUserType(e.target.value);
  const handleUserNameChange = (e) => setUserName(e.target.value);
  const handleUserIdChange = (e) => setUserId(e.target.value);
  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setContentData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId, type: userType, name: userName })
      });
      const data = await response.json();
      console.log(data.message);
      handleCloseModal();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeactivateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/users/deactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId })
      });
      const data = await response.json();
      console.log(data.message);
      handleCloseModal();
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  const handleCreateContent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...contentData, category: selectedCategory }) // Include selected category
      });
      const data = await response.json();
      console.log(data.message);
      setContentList([...contentList, { ...contentData, type: contentType, category: selectedCategory }]); // Update content list with new content
      handleCloseModal();
    } catch (error) {
      console.error("Error creating content:", error);
    }
  };

  const handleCategorySelect = (type) => setContentType(type);

  return (
    <div className="dashboard-containers">
      <div className="sidebar">
        <div className="logo">Logo</div>
        <div className="sidebar-item">
          <MdOutlineSpaceDashboard className="sidebar-icon" /> 
          <span className="sidebar-text">Dashboard</span>
        </div>
        <p className="sidebar-item">
          <CiUser className="sidebar-icon" /> 
          <span className="sidebar-text">Profile</span>
        </p>
        <div className="sidebar-item" onClick={() => handleOpenModal('addUser', addUserRef)}>
          <TiUserAdd className="sidebar-icon" />
          <span className="sidebar-text">Add User</span>
        </div>
        <div className="sidebar-item" onClick={() => handleOpenModal('deactivateUser', deactivateUserRef)}>
          <HiOutlineUserRemove className="sidebar-icon" />
          <span className="sidebar-text">Deactivate User</span>
        </div>
        <div className="add-icon-container" onClick={() => handleOpenModal('addContent')}>
          <IoAddCircleOutline className="add-icon" /><span className="sidebar-text">Add Content</span>
        </div>
        <div className="profile-section">
          {isLoggedIn ? (
            <i className="sidebar-item">
              <IoIosLogOut className="sidebar-icon" /><span className="sidebar-text">{role}</span>
            </i>
          ) : (
            <i className="sidebar-item">
              <IoIosLogOut className="sidebar-icon" /><span className="sidebar-text">Login</span>
            </i>
          )}
        </div>
      </div>

      <div className="main-content">
        <div className="content">
          {contentList.length > 0 && contentList.map((content, index) => (
            <div key={index} className="section">
              <div className="content-item">
                <img src={content.thumbnail} alt={`${content.type} Thumbnail`} className="content-thumbnail" />
                <h3>{content.title}</h3>
                <p>{content.description}</p>
                <a href={content.link} target="_blank" rel="noopener noreferrer">
                  {content.type === 'Video' ? 'Watch Video' : content.type === 'Audio' ? 'Listen to Audio' : 'Read Article'}
                </a>
                <ul className="actions">
                  <li>
                    <button className="categorize-btn" onClick={() => handleOpenModal('categorizeContent')}>
                      Categorize <IoIosArrowDropdown />
                    </button>
                  </li>
                  <li>
                    <button className="approve-btn">
                      Approve <FcApprove />
                    </button>
                  </li>
                  <li>
                    <button className="flag-btn">
                      Flag <CiFlag1 />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && modalType === 'addUser' && (
        <div className="modal-overlay">
          <div className="modal-content add-user-modal">
            <h2>Add a User</h2>
            <form onSubmit={handleAddUser}>
              <label>
                User Type:
                <select value={userType} onChange={handleUserTypeChange} required>
                  <option value="">Select User Type</option>
                  <option value="Staff">Staff</option>
                  <option value="Student">Student</option>
                </select>
              </label>
              <label>
                Name:
                <input type="text" value={userName} onChange={handleUserNameChange} required />
              </label>
              <label>
                User ID:
                <input type="text" value={userId} onChange={handleUserIdChange} required />
              </label>
              <button type="submit">Add User</button>
              <button type="button" onClick={handleCloseModal}>Close</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && modalType === 'deactivateUser' && (
        <div className="modal-overlay">
          <div className="modal-content deactivate-user-modal">
            <h2>Deactivate a User</h2>
            <form onSubmit={handleDeactivateUser}>
              <label>
                User ID:
                <input type="text" value={userId} onChange={handleUserIdChange} required />
              </label>
              <button type="submit">Deactivate User</button>
              <button type="button" onClick={handleCloseModal}>Close</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && modalType === 'addContent' && (
        <div className="modal-overlay">
          <div className="modal-content add-content-modal">
            <h2>Add New Content</h2>
            <form onSubmit={handleCreateContent}>
              <label>
                Content Type:
                <select value={contentType} onChange={(e) => handleCategorySelect(e.target.value)} required>
                  <option value="">Select Content Type</option>
                  <option value="Video">Video</option>
                  <option value="Audio">Audio</option>
                  <option value="Article">Article</option>
                </select>
              </label>
              <label>
                Title:
                <input type="text" name="title" value={contentData.title} onChange={handleContentChange} required />
              </label>
              <label>
                Description:
                <textarea name="description" value={contentData.description} onChange={handleContentChange} required />
              </label>
              <label>
                Link:
                <input type="text" name="link" value={contentData.link} onChange={handleContentChange} required />
              </label>
              <label>
                Thumbnail URL:
                <input type="text" name="thumbnail" value={contentData.thumbnail} onChange={handleContentChange} required />
              </label>
              <label>
                Category:
                <select value={selectedCategory} onChange={handleCategoryChange} required>
                  <option value="">Select Category</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Fullstack">Fullstack</option>
                  <option value="Front-End">Front-End</option>
                </select>
              </label>
              <button type="submit">Add Content</button>
              <button type="button" onClick={handleCloseModal}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
