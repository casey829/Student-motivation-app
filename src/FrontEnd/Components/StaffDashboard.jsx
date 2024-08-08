import React, { useState, useEffect } from "react";
import { CiFlag1 } from "react-icons/ci";
import { FcApprove } from "react-icons/fc";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { AiOutlineLike, AiOutlineDislike, AiOutlineComment } from "react-icons/ai";
import { CiUser } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";

function StaffDashboard() {
  const [userName] = useState("Casey");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentType, setContentType] = useState("");
  const [contentData, setContentData] = useState({
    title: "",
    description: "",
    link: ""
  });
  const [contentList, setContentList] = useState({
    Videos: [],
    Audios: [],
    Articles: []
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const storedContentList = localStorage.getItem('contentList');
    const storedCategories = localStorage.getItem('categories');
    if (storedContentList) {
      setContentList(JSON.parse(storedContentList));
    }
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  const handleCategorize = async (type) => {
    try {
      const response = await fetch(`http://localhost:3000/categories`, {
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
      description: "",
      link: ""
    });
    setSelectedCategory("");
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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddCategory = () => {
    const newCategory = prompt("Enter new category name:");
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory];
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
    }
  };

  const handleCreateContent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/content/${selectedCategory}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contentData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      console.log(data.message);
  
      const updatedContentList = {
        ...contentList,
        [selectedCategory]: [...(contentList[selectedCategory] || []), contentData]
      };
      localStorage.setItem('contentList', JSON.stringify(updatedContentList));
      setContentList(updatedContentList);
      handleCloseModal();
    } catch (error) {
      console.error("Error creating content:", error.message);
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
          <div className="header-right">
            <p className="user-name">
              <CiUser />
              {userName}
            </p>
            <i className="logout-icon"><IoIosLogOut /></i>
          </div>
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

          <div className="new-content-list">
            <h2>Newly Created Content</h2>
            <ul>
              {Object.keys(contentList).map((category) => (
                <div className={category.toLowerCase()} key={category}>
                  <h3>{category}</h3>
                  <ul>
                    {contentList[category].map((content, index) => (
                      <li key={index}>
                        <h4>{content.title}</h4>
                        <p>{content.description}</p>
                        {content.link && <a href={content.link} target="_blank" rel="noopener noreferrer">Link</a>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create {contentType}</h2>
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
                  placeholder="http://example.com"
                />
              </label>
              <label>
                Select Category:
                <select value={selectedCategory} onChange={handleCategoryChange} required>
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                  <option value='video'>
                Video
                </option>
                <option value='audio'>Audio</option>
                <option value='article'>Article</option>
                </select>
                <button type="button" onClick={handleAddCategory}>Add New Category</button>
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
