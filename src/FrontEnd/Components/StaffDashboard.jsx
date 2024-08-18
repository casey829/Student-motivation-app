import React, { useState, useEffect } from 'react';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { TiUserAdd } from 'react-icons/ti';
import { RiFileMusicLine, RiArticleLine, RiVideoLine } from 'react-icons/ri';
import { IoIosLogOut } from 'react-icons/io';
import { BiEdit } from 'react-icons/bi';

function StaffDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [contentType, setContentType] = useState("");
  const [contentData, setContentData] = useState({
    id: "",
    title: "",
    description: "",
    file: null,
    category: ""
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

  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const [categoriesResponse, profilesResponse] = await Promise.all([
          fetch('http://127.0.0.1:5000/categories', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://127.0.0.1:5000/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!categoriesResponse.ok || !profilesResponse.ok) {
          throw new Error('Network response was not ok.');
        }

        const categoriesData = await categoriesResponse.json();
        const profilesData = await profilesResponse.json();

        setCategories(categoriesData);
        setProfiles(profilesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        
      }
    };

    fetchData();
  }, []);
console.log(categories)
  useEffect(() => {
    const fetchContentData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const [videosResponse, audiosResponse, articlesResponse] = await Promise.all([
          fetch('http://127.0.0.1:5000/videos', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://127.0.0.1:5000/audios', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://127.0.0.1:5000/articles', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!videosResponse.ok || !audiosResponse.ok || !articlesResponse.ok) {
          throw new Error('Network response was not ok.');
        }

        const videosData = await videosResponse.json();
        const audiosData = await audiosResponse.json();
        const articlesData = await articlesResponse.json();

        setVideos(videosData);
        setAudios(audiosData);
        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching content data:', error);
      }
    };

    fetchContentData();
  }, []);

  const handleCreateContent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', contentData.title);
    formData.append('file', contentData.file);
    formData.append('description', contentData.description);
    formData.append('category', contentData.category);

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
        alert('Content created successfully.');
        handleCloseModal();
        // Refresh the content list
        await fetchContentData();
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
      setContentData({ id: "", title: "", description: "", link: "", file: null, category: "" });
    } else if (type === 'createProfile') {
      setProfileData({ userName: "", email: "", password: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContentType("");
    setContentData({ id: "", title: "", description: "", link: "", file: null, category: "" });
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

  const handleLogout = () => {
    const token = localStorage.getItem('access_token');
    fetch('http://127.0.0.1:5000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.ok) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      } else {
        alert('Logout failed.');
      }
    })
    .catch(error => {
      console.error('Error during logout:', error);
      alert('Logout failed. Please try again.');
    });
  };

  return (
    <div className='dashboard'>
      <aside className='sidebar'>
        <nav>
          <ul>
            <li><a onClick={() => handleOpenModal('createContent', 'videos')}><RiVideoLine /> Add Video</a></li>
            <li><a onClick={() => handleOpenModal('createContent', 'audios')}><RiFileMusicLine /> Add Audio</a></li>
            <li><a onClick={() => handleOpenModal('createContent', 'articles')}><RiArticleLine /> Add Article</a></li>
            <li><a onClick={() => handleOpenModal('createProfile')}><TiUserAdd /> Create Profile</a></li>
            <li><a onClick={handleOpenCategoryModal}>Create Category</a></li>
            <li><a onClick={handleLogout}><IoIosLogOut /> Logout</a></li>
          </ul>
        </nav>
      </aside>
      
      <main className='content'>
        <section>
          <h2>Videos</h2>
          {/* Replace contentList with fetched videos data */}
          {videos.map(video => (
            <div key={video.id}>
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              {/* Add more video details here */}
            </div>
          ))}
        </section>
        
        <section>
          <h2>Audios</h2>
          {/* Replace contentList with fetched audios data */}
          {audios.map(audio => (
            <div key={audio.id}>
              <h3>{audio.title}</h3>
              <p>{audio.description}</p>
              {/* Add more audio details here */}
            </div>
          ))}
        </section>
        
        <section>
          <h2>Articles</h2>
          {/* Replace contentList with fetched articles data */}
          {articles.map(article => (
            <div key={article.id}>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              {/* Add more article details here */}
            </div>
          ))}
        </section>
      </main>

      {/* Modal for creating content */}
      {isModalOpen && modalType === 'createContent' && (
        <div className='modal'>
          <h2>Create {contentType}</h2>
          <form onSubmit={handleCreateContent}>
            <label>
              Title:
              <input type='text' name='title' value={contentData.title} onChange={handleContentChange} required />
            </label>
            <label>
              Description:
              <textarea name='description' value={contentData.description} onChange={handleContentChange} required />
            </label>
            {contentType !== 'articles' && (
              <label>
                File:
                <input type='file' name='file' onChange={(e) => setContentData({ ...contentData, file: e.target.files[0] })} required />
              </label>
            )}
            {contentType === 'articles' && (
              <label>
                Content:
                <textarea name='link' value={contentData.link} onChange={handleContentChange} required />
              </label>
            )}
            <label>
              Category:
              <select name='category' value={contentData.category} onChange={handleContentChange} required>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </label>
            <button type='submit'>Create</button>
            <button type='button' onClick={handleCloseModal}>Cancel</button>
          </form>
        </div>
      )}

      {/* Modal for creating profile */}
      {isModalOpen && modalType === 'createProfile' && (
        <div className='modal'>
          <h2>Create Profile</h2>
          <form onSubmit={handleCreateProfile}>
            <label>
              Username:
              <input type='text' name='userName' value={profileData.userName} onChange={handleProfileChange} required />
            </label>
            <label>
              Email:
              <input type='email' name='email' value={profileData.email} onChange={handleProfileChange} required />
            </label>
            <label>
              Password:
              <input type='password' name='password' value={profileData.password} onChange={handleProfileChange} required />
            </label>
            <button type='submit'>Create</button>
            <button type='button' onClick={handleCloseModal}>Cancel</button>
          </form>
        </div>
      )}

      {/* Modal for creating category */}
      {isCategoryModalOpen && (
        <div className='modal'>
          <h2>Create Category</h2>
          <form onSubmit={handleCreateCategory}>
            <label>
              Category Name:
              <input type='text' name='name' value={newCategory.name} onChange={handleCategoryChange} required />
            </label>
            <label>
              Description:
              <textarea name='description' value={newCategory.description} onChange={handleCategoryChange} required />
            </label>
            <button type='submit'>Create</button>
            <button type='button' onClick={handleCloseCategoryModal}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;
