import React, { useState, useEffect } from 'react';
import { FaUser, FaPlus, FaCommentAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdPostAdd, MdOutlineBookmark } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';

const API_URL = 'http://127.0.0.1:5000/student/dashboard'; // Base URL for API

const StudentDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [newPost, setNewPost] = useState({ title: "", description: "", link: "", thumbnail: "" });
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");

  // File upload states
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [articleContent, setArticleContent] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchPosts();
    fetchWishlist();
    fetchInterests();
  }, []);

  const handleRequest = async (url, method, body = null) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on how you're storing JWT
        },
        body: body ? JSON.stringify(body) : null
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error with ${method} request to ${url}: ${response.status} ${response.statusText}, Response: ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      try {
        return await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError);
        throw new Error('Invalid JSON response');
      }
    } catch (error) {
      console.error(`Request failed:`, error);
      throw error;
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await handleRequest(`http://127.0.0.1:5000/content/video/<int:content_id>`, 'GET');
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const data = await handleRequest(`${API_URL}/wishlists`, 'GET');
      setWishlist(data);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const fetchInterests = async () => {
    try {
      const interests = await handleRequest(`${API_URL}/categories`, 'GET');
      setInterests(interests);
    } catch (error) {
      console.error('Failed to fetch interests:', error);
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (newPost.title && newPost.description && newPost.link && newPost.thumbnail) {
      try {
        const data = await handleRequest(`${API_URL}/content`, 'POST', newPost);
        setPosts(prevPosts => [...prevPosts, data]);
        localStorage.setItem('posts', JSON.stringify([...posts, data]));
        setNewPost({ title: "", description: "", link: "", thumbnail: "" });
        handleCloseModal();
      } catch (error) {
        console.error('Failed to add post:', error);
      }
    }
  };

  const handleAddInterest = async () => {
    if (newInterest && !interests.includes(newInterest)) {
      try {
        const newInterestData = { name: newInterest };
        await handleRequest(`${API_URL}/categories`, 'POST', newInterestData);
        setNewInterest('');
        fetchInterests();
      } catch (error) {
        console.error("Failed to add interest:", error);
      }
    }
  };

  const handleAddToWishlist = async (post) => {
    try {
      if (isPostInWishlist(post.id)) {
        await handleRequest(`${API_URL}/wishlists/${post.id}`, 'DELETE');
        const updatedWishlist = wishlist.filter(item => item.contentId !== post.id);
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      } else {
        const response = await handleRequest(`${API_URL}/wishlists`, 'POST', { contentId: post.id });
        if (response.message) {
          const updatedWishlist = [...wishlist, { contentId: post.id }];
          setWishlist(updatedWishlist);
          localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        }
      }
    } catch (error) {
      console.error('Failed to add/remove wishlist:', error);
    }
  };

  const handleCommentChange = (postId, content) => {
    setComments(prevComments => ({
      ...prevComments,
      [postId]: content
    }));
  };

  const handleAddComment = async (postId) => {
    const newComment = { content: comments[postId] };
    try {
      await handleRequest(`${API_URL}/content/${postId}/comments`, 'POST', newComment);
      fetchPosts();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await handleRequest(`${API_URL}/content/${postId}/comments/${commentId}`, 'DELETE');
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setProfileData({ name: "", email: "" });
    setNewPost({ title: "", description: "", link: "", thumbnail: "" });
    setNewInterest('');
    setVideoFile(null);
    setAudioFile(null);
    setArticleContent({ title: "", content: "" });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await handleRequest(`${API_URL}/profiles`, 'PATCH', profileData);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleClearWishlist = async () => {
    try {
      await handleRequest(`${API_URL}/wishlists`, 'DELETE');
      setWishlist([]);
      localStorage.removeItem('wishlist');
      console.log('Wishlist cleared');
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
    }
  };

  const isPostInWishlist = (postId) => {
    return wishlist.some(item => item.contentId === postId);
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (videoFile && videoFile.size <= 100 * 1024 * 1024) { // 100 MB
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const fileDataBase64 = reader.result.split(',')[1];
          const data = { file: fileDataBase64, title: "Video Title" }; // Replace with actual title input if needed
          try {
            await handleRequest(`${API_URL}/upload/video`, 'POST', data);
            handleCloseModal();
          } catch (error) {
            console.error('Failed to upload video:', error);
          }
        };
        reader.readAsDataURL(videoFile);
      } catch (error) {
        console.error('Failed to upload video:', error);
      }
    }
  };

  const handleAudioUpload = async (e) => {
    e.preventDefault();
    if (audioFile && audioFile.size <= 50 * 1024 * 1024) { // 50 MB
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const fileDataBase64 = reader.result.split(',')[1];
          const data = { file: fileDataBase64, title: "Audio Title" }; // Replace with actual title input if needed
          try {
            await handleRequest(`${API_URL}/upload/audio`, 'POST', data);
            handleCloseModal();
          } catch (error) {
            console.error('Failed to upload audio:', error);
          }
        };
        reader.readAsDataURL(audioFile);
      } catch (error) {
        console.error('Failed to upload audio:', error);
      }
    }
  };

  const handleArticleUpload = async (e) => {
    e.preventDefault();
    if (articleContent.title && articleContent.content) {
      try {
        await handleRequest(`${API_URL}/upload/article`, 'POST', articleContent);
        handleCloseModal();
      } catch (error) {
        console.error('Failed to upload article:', error);
      }
    }
  };

  return (
    <div>
      {/* Your existing JSX code for displaying posts, comments, etc. */}

      <button onClick={() => handleOpenModal("profile")}>Edit Profile</button>
      <button onClick={() => handleOpenModal("post")}>Add Post</button>
      <button onClick={() => handleOpenModal("interest")}>Add Interest</button>
      <button onClick={() => handleOpenModal("video")}>Upload Video</button>
      <button onClick={() => handleOpenModal("audio")}>Upload Audio</button>
      <button onClick={() => handleOpenModal("article")}>Upload Article</button>

      {isModalOpen && (
        <div className="modal">
          <IoMdClose className="close-icon" onClick={handleCloseModal} />
          {modalType === "profile" && (
            <form onSubmit={handleProfileUpdate}>
              <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} placeholder="Name" />
              <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} placeholder="Email" />
              <button type="submit">Update Profile</button>
            </form>
          )}
          {modalType === "post" && (
            <form onSubmit={handleAddPost}>
              <input type="text" name="title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} placeholder="Post Title" />
              <input type="text" name="description" value={newPost.description} onChange={(e) => setNewPost({ ...newPost, description: e.target.value })} placeholder="Post Description" />
              <input type="text" name="link" value={newPost.link} onChange={(e) => setNewPost({ ...newPost, link: e.target.value })} placeholder="Post Link" />
              <input type="text" name="thumbnail" value={newPost.thumbnail} onChange={(e) => setNewPost({ ...newPost, thumbnail: e.target.value })} placeholder="Post Thumbnail" />
              <button type="submit">Add Post</button>
            </form>
          )}
          {modalType === "interest" && (
            <div>
              <input type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} placeholder="New Interest" />
              <button onClick={handleAddInterest}>Add Interest</button>
            </div>
          )}
          {modalType === "video" && (
            <form onSubmit={handleVideoUpload}>
              <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
              <button type="submit">Upload Video</button>
            </form>
          )}
          {modalType === "audio" && (
            <form onSubmit={handleAudioUpload}>
              <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
              <button type="submit">Upload Audio</button>
            </form>
          )}
          {modalType === "article" && (
            <form onSubmit={handleArticleUpload}>
              <input type="text" value={articleContent.title} onChange={(e) => setArticleContent({ ...articleContent, title: e.target.value })} placeholder="Article Title" />
              <textarea value={articleContent.content} onChange={(e) => setArticleContent({ ...articleContent, content: e.target.value })} placeholder="Article Content" />
              <button type="submit">Upload Article</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
