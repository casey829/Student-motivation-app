import React, { useState, useEffect } from 'react';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { TiUserAdd } from 'react-icons/ti';
import { RiFileMusicLine, RiArticleLine, RiVideoLine } from 'react-icons/ri';
import { IoIosLogOut } from 'react-icons/io';
import { BiEdit } from 'react-icons/bi';
import { CiFlag1 } from 'react-icons/ci';

function StaffDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [contentType, setContentType] = useState("");
  const [contentData, setContentData] = useState({
    id: "",
    title: "",
    description: "",
    link: "",
    file: null
  });
  const [contentList, setContentList] = useState({
    video: [],
    audio: [],
    article: []
  });
  const [categories, setCategories] = useState([]);
  const [profileData, setProfileData] = useState({
    userName: "",
    email: "",
    password: ""
  });
  const [profiles, setProfiles] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const [contentResponse, categoriesResponse, profilesResponse] = await Promise.all([
          fetch('http://127.0.0.1:5000/content', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://127.0.0.1:5000/api/categories', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://127.0.0.1:5000/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!contentResponse.ok || !categoriesResponse.ok || !profilesResponse.ok) {
          throw new Error('Network response was not ok.');
        }

        const contentData = await contentResponse.json();
        const categoriesData = await categoriesResponse.json();
        const profilesData = await profilesResponse.json();

        setContentList(contentData);
        setCategories(categoriesData);
        setProfiles(profilesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCreateContent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', contentData.title);
    formData.append('file', contentData.file);

    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/upload/${contentType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const result = await response.json();

      if (response.ok) {
        const updatedContentList = { 
          ...contentList, 
          [contentType]: [...(contentList[contentType] || []), result.data] 
        };
        setContentList(updatedContentList);
        handleCloseModal();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating content:", error.message);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const bodyData = {
      userName: profileData.userName,
      email: profileData.email,
      password: profileData.password
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });
      const result = await response.json();

      if (response.ok) {
        alert('Profile created successfully.');
        handleCloseModal();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating profile:", error.message);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const { name, description } = newCategory;

    if (!name || !description || description.length < 5) {
      alert("Category name and description are required, and description must be at least 5 characters long.");
      return;
    }

    if (categories.find(cat => cat.name === name)) {
      alert("Category already exists.");
      return;
    }

    const updatedCategories = [...categories, { name, description }];
    setCategories(updatedCategories);
    setNewCategory({ name: '', description: '' });
    setIsCategoryModalOpen(false);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:5000/create-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Category added successfully!");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    }
  };

  const handleOpenModal = (type, category = "") => {
    setModalType(type);
    if (type === 'createContent') {
      setContentType(category);
      setContentData({ id: "", title: "", description: "", link: "", file: null });
    } else if (type === 'createProfile') {
      setProfileData({ userName: "", email: "", password: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContentType("");
    setContentData({ id: "", title: "", description: "", link: "", file: null });
    setProfileData({ userName: "", email: "", password: "" });
  };

  const handleOpenCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setNewCategory({ name: '', description: '' });
  };

  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setContentData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prevData => ({ ...prevData, [name]: value }));
  };

  function handleLogout() {
    const token = localStorage.getItem('access_token');

    fetch('http://127.0.0.1:5000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        localStorage.clear();
        window.location.href = '/';  // Redirect to the homepage
      })
      .catch(error => {
        console.error("Error logging out:", error);
        alert("Something went wrong");
      });
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '200px', backgroundColor: '#f4f4f4', padding: '20px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Logo</div>
        <div style={{ margin: '10px 0' }}>
          <MdOutlineSpaceDashboard style={{ fontSize: '24px' }} />
          <span>Dashboard</span>
        </div>
        <div style={{ margin: '10px 0', cursor: 'pointer' }} onClick={() => handleOpenModal('createProfile')}>
          <TiUserAdd style={{ fontSize: '24px' }} />
          <span>Create Profile</span>
        </div>
        <div style={{ margin: '10px 0', cursor: 'pointer' }} onClick={() => handleOpenModal('createContent', 'audio')}>
          <RiFileMusicLine style={{ fontSize: '24px' }} />
          <span>Add Audio</span>
        </div>
        <div style={{ margin: '10px 0', cursor: 'pointer' }} onClick={() => handleOpenModal('createContent', 'article')}>
          <RiArticleLine style={{ fontSize: '24px' }} />
          <span>Add Article</span>
        </div>
        <div style={{ margin: '10px 0', cursor: 'pointer' }} onClick={() => handleOpenModal('createContent', 'video')}>
          <RiVideoLine style={{ fontSize: '24px' }} />
          <span>Add Video</span>
        </div>
        <div style={{ margin: '10px 0', cursor: 'pointer' }} onClick={handleOpenCategoryModal}>
          <BiEdit style={{ fontSize: '24px' }} />
          <span>Add Category</span>
        </div>
        <div style={{ margin: '10px 0', cursor: 'pointer' }} onClick={handleLogout}>
          <IoIosLogOut style={{ fontSize: '24px' }} />
          <span>Logout</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Content Management</h1>
        <div>
          <h2>Videos</h2>
          <ul>
            {(contentList.video || []).map(content => (
              <li key={content.id}>{content.title || 'Untitled'}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Audio</h2>
          <ul>
            {(contentList.audio || []).map(content => (
              <li key={content.id}>{content.title || 'Untitled'}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Articles</h2>
          <ul>
            {(contentList.article || []).map(content => (
              <li key={content.id}>{content.title || 'Untitled'}</li>
            ))}
          </ul>
        </div>
      </div>
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '400px' }}>
            <h2>{modalType === 'createProfile' ? 'Create Profile' : `Add ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`}</h2>
            {modalType === 'createProfile' ? (
              <form onSubmit={handleCreateProfile}>
                <input
                  type="text"
                  name="userName"
                  value={profileData.userName}
                  onChange={handleProfileChange}
                  placeholder="Username"
                  style={{ margin: '10px 0', padding: '10px', width: '100%' }}
                />
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="Email"
                  style={{ margin: '10px 0', padding: '10px', width: '100%' }}
                />
                <input
                  type="password"
                  name="password"
                  value={profileData.password}
                  onChange={handleProfileChange}
                  placeholder="Password"
                  style={{ margin: '10px 0', padding: '10px', width: '100%' }}
                />
                <button type="submit" style={{ padding: '10px', width: '100%' }}>Create Profile</button>
              </form>
            ) : (
              <form onSubmit={handleCreateContent}>
                <input
                  type="text"
                  name="title"
                  value={contentData.title}
                  onChange={handleContentChange}
                  placeholder="Title"
                  style={{ margin: '10px 0', padding: '10px', width: '100%' }}
                />
                {contentType === 'article' ? (
                  <textarea
                    name="description"
                    value={contentData.description}
                    onChange={handleContentChange}
                    placeholder="Description"
                    style={{ margin: '10px 0', padding: '10px', width: '100%', height: '100px' }}
                  />
                ) : (
                  <input
                    type="file"
                    name="file"
                    onChange={(e) => setContentData(prevData => ({ ...prevData, file: e.target.files[0] }))}
                    style={{ margin: '10px 0', width: '100%' }}
                  />
                )}
                <button type="submit" style={{ padding: '10px', width: '100%' }}>Submit</button>
                <button type="button" onClick={handleCloseModal} style={{ padding: '10px', width: '100%', marginTop: '10px' }}>Close</button>
              </form>
            )}
          </div>
        </div>
      )}
      {isCategoryModalOpen && (
        <div style={{
          position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '400px' }}>
            <h2>Add Category</h2>
            <form onSubmit={handleCreateCategory}>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleCategoryChange}
                placeholder="Category Name"
                style={{ margin: '10px 0', padding: '10px', width: '100%' }}
              />
              <textarea
                name="description"
                value={newCategory.description}
                onChange={handleCategoryChange}
                placeholder="Category Description"
                style={{ margin: '10px 0', padding: '10px', width: '100%', height: '100px' }}
              />
              <button type="submit" style={{ padding: '10px', width: '100%' }}>Add Category</button>
              <button type="button" onClick={handleCloseCategoryModal} style={{ padding: '10px', width: '100%', marginTop: '10px' }}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;
