import React, { useState } from "react";
import { CiFlag1 } from "react-icons/ci";
import { FcApprove } from "react-icons/fc";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { AiOutlineLike, AiOutlineDislike, AiOutlineComment } from "react-icons/ai";

function StaffDashboard() {
  const [userName] = useState("Casey");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentType, setContentType] = useState("");
  const [contentData, setContentData] = useState({
    title: "",
    description: ""
  });

  const handleCategorize = async (type) => {
    try {
      const response = await fetch(`/api/categorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error categorizing content:", error);
    }
  };

  const handleApprove = async (type) => {
    try {
      const response = await fetch(`/api/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error approving content:", error);
    }
  };

  const handleFlag = async (type) => {
    try {
      const response = await fetch(`/api/flag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error flagging content:", error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/like`, {
        method: 'POST'
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error liking content:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(`/api/dislike`, {
        method: 'POST'
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error disliking content:", error);
    }
  };

  const handleComment = async () => {
    try {
      const response = await fetch(`/api/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment: "Sample comment" })
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error commenting on content:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContentType("");
    setContentData({
      title: "",
      description: ""
    });
  };

  const handleCategorySelect = (type) => {
    setContentType(type);
    handleOpenModal();
  };

  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setContentData({
      ...contentData,
      [name]: value
    });
  };

  const handleCreateContent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/create-${contentType}`, {
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

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">Logo</div>
        <div className="dashboard-text">Dashboard</div>
      </div>

      <div className="add-icon-container">
        <div className="add-icon" onClick={handleOpenModal}>
          <IoAddCircleOutline />
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="user-name">{userName}</div>
        </div>

        <div className="content">
          <div className="center-text">
            <h2>Categorize Uploaded Videos</h2>
          </div>

          <div className="section">
            <ul className="actions">
              <li>
                <button
                  className="categorize-btn"
                  onClick={() => handleCategorize("Videos")}
                >
                  Categorize <IoIosArrowDropdown />
                </button>
              </li>
              <li>
                <button
                  className="approve-btn"
                  onClick={() => handleApprove("Videos")}
                >
                  Approve <FcApprove />
                </button>
              </li>
              <li>
                <button
                  className="flag-btn"
                  onClick={() => handleFlag("Videos")}
                >
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
                <button
                  className="categorize-btn"
                  onClick={() => handleCategorize("Audios")}
                >
                  Categorize <IoIosArrowDropdown />
                </button>
              </li>
              <li>
                <button
                  className="approve-btn"
                  onClick={() => handleApprove("Audios")}
                >
                  Approve <FcApprove />
                </button>
              </li>
              <li>
                <button
                  className="flag-btn"
                  onClick={() => handleFlag("Audios")}
                >
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
                <button
                  className="categorize-btn"
                  onClick={() => handleCategorize("Articles")}
                >
                  Categorize <IoIosArrowDropdown />
                </button>
              </li>
              <li>
                <button
                  className="approve-btn"
                  onClick={() => handleApprove("Articles")}
                >
                  Approve <FcApprove />
                </button>
              </li>
              <li>
                <button
                  className="flag-btn"
                  onClick={() => handleFlag("Articles")}
                >
                  Flag <CiFlag1 />
                </button>
              </li>
            </ul>
          </div>

          <div className="center-text">
            <h2>Review Content</h2>
          </div>

          <div className="section">
            <ul className="actions">
              <li>
                <button className="like-btn" onClick={handleLike}>
                  Like <AiOutlineLike />
                </button>
              </li>
              <li>
                <button className="dislike-btn" onClick={handleDislike}>
                  Dislike <AiOutlineDislike />
                </button>
              </li>
              <li>
                <button className="comment-btn" onClick={handleComment}>
                  Comment <AiOutlineComment />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isModalOpen && !contentType && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Select Content Type</h2>
            <div className="modal-buttons">
              <button className="modal-btn" onClick={() => handleCategorySelect("Video")}>
                Video
              </button>
              <button className="modal-btn" onClick={() => handleCategorySelect("Audio")}>
                Audio
              </button>
              <button className="modal-btn" onClick={() => handleCategorySelect("Article")}>
                Article
              </button>
              <button className="modal-btn close-btn" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    
      {contentType && (
        <div className="modal-overlay">
          <div className="modal-content">
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
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCloseModal}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;
