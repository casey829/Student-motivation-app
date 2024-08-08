import React, { useState } from "react";
import { CiFlag1 } from "react-icons/ci";
import { FcApprove } from "react-icons/fc";
import { IoIosArrowDropdown, IoIosLogOut } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { AiOutlineLike, AiOutlineDislike, AiOutlineComment } from "react-icons/ai";

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
    link: ""
  });

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
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
      link: ""
    });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setContentData({
      ...contentData,
      [name]: value
    });
  };

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
      const response = await fetch('http://localhost:3000/users', {
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
      const response = await fetch(`http://localhost:3000/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contentData)
      });
      const data = await response.json();
      console.log(data.message);
      handleCloseModal();
    } catch (error) {
      console.error("Error creating content:", error);
    }
  };

  const handleCategorySelect = (type) => {
    setContentType(type);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">Logo</div>
        <div className="dashboard-text">Dashboard</div>
      </div>

      <div className="add-icon-container">
        <div className="add-icon" onClick={() => handleOpenModal('addContent')}>
          <IoAddCircleOutline />
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="header-right">
            <p className="user-name">Casey</p>
            <i className="logout-icon"><IoIosLogOut /></i>
          </div>
        </div>

        <div className="user-management-container">
          <div className="user-section">
            <h2>Add a User</h2>
            <button className="user-btn" onClick={() => handleOpenModal('addUser')}>
              Add User
            </button>
          </div>
          <div className="user-section">
            <h2>Deactivate User</h2>
            <button className="user-btn" onClick={() => handleOpenModal('deactivateUser')}>
              Deactivate User
            </button>
          </div>
        </div>

        <div className="content">
          <div className="center-text">
            <h2>Categorize Uploaded Videos</h2>
          </div>
          <div className="section">
            <ul className="actions">
              <li>
                <button className="categorize-btn" onClick={() => handleCategorize("Videos")}>
                  Categorize <IoIosArrowDropdown />
                </button>
              </li>
              <li>
                <button className="approve-btn" onClick={() => handleApprove("Videos")}>
                  Approve <FcApprove />
                </button>
              </li>
              <li>
                <button className="flag-btn" onClick={() => handleFlag("Videos")}>
                  Flag <CiFlag1 />
                </button>
              </li>
            </ul>
          </div>

          <div className="center-text">
            <h2>Categorize Uploaded Audios</h2>
          </div>
          <div className="section">
            <ul className="actions">
              <li>
                <button className="categorize-btn" onClick={() => handleCategorize("Audios")}>
                  Categorize <IoIosArrowDropdown />
                </button>
              </li>
              <li>
                <button className="approve-btn" onClick={() => handleApprove("Audios")}>
                  Approve <FcApprove />
                </button>
              </li>
              <li>
                <button className="flag-btn" onClick={() => handleFlag("Audios")}>
                  Flag <CiFlag1 />
                </button>
              </li>
            </ul>
          </div>

          <div className="center-text">
            <h2>Categorize Uploaded Articles</h2>
          </div>
          <div className="section">
            <ul className="actions">
              <li>
                <button className="categorize-btn" onClick={() => handleCategorize("Articles")}>
                  Categorize <IoIosArrowDropdown />
                </button>
              </li>
              <li>
                <button className="approve-btn" onClick={() => handleApprove("Articles")}>
                  Approve <FcApprove />
                </button>
              </li>
              <li>
                <button className="flag-btn" onClick={() => handleFlag("Articles")}>
                  Flag <CiFlag1 />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isModalOpen && modalType === 'addUser' && (
        <div className="modal-overlay">
          <div className="modal-content">
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
                <input
                  type="text"
                  value={userName}
                  onChange={handleUserNameChange}
                  required
                />
              </label>
              <label>
                User ID:
                <input
                  type="text"
                  value={userId}
                  onChange={handleUserIdChange}
                  required
                />
              </label>
              <button type="submit">Add User</button>
              <button type="button" onClick={handleCloseModal}>Close</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && modalType === 'deactivateUser' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Deactivate a User</h2>
            <form onSubmit={handleDeactivateUser}>
              <label>
                User ID:
                <input
                  type="text"
                  value={userId}
                  onChange={handleUserIdChange}
                  required
                />
              </label>
              <button type="submit">Deactivate User</button>
              <button type="button" onClick={handleCloseModal}>Close</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && modalType === 'addContent' && (
        <div className="modal-overlay">
          <div className="modal-content">
            {!contentType ? (
              <>
                <h2>Select Content Type</h2>
                <button onClick={() => handleCategorySelect('Video')}>Add Video</button>
                <button onClick={() => handleCategorySelect('Audio')}>Add Audio</button>
                <button onClick={() => handleCategorySelect('Article')}>Add Article</button>
              </>
            ) : (
              <>
                <h2>Create New {contentType}</h2>
                <form onSubmit={handleCreateContent}>
                  <label>
                    Title:
                    <input
                      type="text"
                      name="title"
                      value={contentData.title}
                      onChange={handleContentChange}
                      required
                    />
                  </label>
                  <label>
                    Description:
                    <textarea
                      name="description"
                      value={contentData.description}
                      onChange={handleContentChange}
                      required
                    />
                  </label>
                  <label>
                    Link:
                    <input
                      type="url"
                      name="link"
                      value={contentData.link}
                      onChange={handleContentChange}
                      required
                    />
                  </label>
                  <button type="submit">Create {contentType}</button>
                  <button type="button" onClick={handleCloseModal}>Close</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
