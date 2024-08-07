/*import React from "react";
import { CiFlag1 } from "react-icons/ci";
import { FcApprove } from "react-icons/fc";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";

function StaffDashboard(){
return (
    <div>
      <div className="dashboard">
        <div className="logo"></div>
        <div className="dashboard">Dashboard</div>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="add-icon"><IoAddCircleOutline /></div>
          <div className="user-name">Marion</div>
        </div>
        <div className="content">
          <div className="video-section">
            <h2>Categorize Uploaded Videos</h2>
            <div className="actions">
            <button>Categorize <IoIosArrowDropdown /></button>
            <button>Approve <FcApprove /></button>
            <button>Flag <CiFlag1 /></button>
          </div>
          </div>
          <div className="audio-section">
            <h2>Categorize Uploaded Audios</h2>
            <div className="actions">
            <button>Categorize <IoIosArrowDropdown /></button>
            <button>Approve <FcApprove /></button>
            <button>Flag <CiFlag1 /></button> <button>Flag</button>
          </div>
          </div>
          <div className="article-section">
            <h2>Categorize Uploaded Articles</h2>
            <div className="actions">
            <button>Categorize <IoIosArrowDropdown /></button>
            <button>Approve <FcApprove /></button>
            <button>Flag <CiFlag1 /></button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;*/
/*import React, { useState } from 'react';
import styles from '../style.css/Dashboard.module.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('videos');

  const renderContent = () => {
    switch (activeTab) {
      case 'videos':
        return <VideoContent />;
      case 'articles':
        return <ArticleContent />;
      case 'audio':
        return <AudioContent />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Staff Dashboard</h1>
        <div className={styles.profile}>
          <img src="http://placeholder.com/user" alt="User profile" />
          <span>John Doe</span>
        </div>
      </header>
      <nav className={styles.nav}>
        <button onClick={() => setActiveTab('videos')}>Videos</button>
        <button onClick={() => setActiveTab('articles')}>Articles</button>
        <button onClick={() => setActiveTab('audio')}>Audio</button>
      </nav>
      <main className={styles.content}>
        {renderContent()}
      </main>
    </div>
  );
};

const VideoContent = () => (
  <div>
    <h2>Videos</h2>
    <div className={styles.mediaList}>
      <MediaItem type="video" title="Introduction to React" />
      <MediaItem type="video" title="Advanced CSS Techniques" />
      <MediaItem type="video" title="JavaScript ES6 Features" />
    </div>
  </div>
);

const ArticleContent = () => (
  <div>
    <h2>Articles</h2>
    <div className={styles.mediaList}>
      <MediaItem type="article" title="10 Tips for Better Code" />
      <MediaItem type="article" title="Understanding Async/Await" />
      <MediaItem type="article" title="The Future of Web Development" />
    </div>
  </div>
);

const AudioContent = () => (
  <div>
    <h2>Audio</h2>
    <div className={styles.mediaList}>
      <MediaItem type="audio" title="Podcast: Web Performance" />
      <MediaItem type="audio" title="Interview with a Senior Developer" />
      <MediaItem type="audio" title="Audio Course: React Hooks" />
    </div>
  </div>
);

const MediaItem = ({ type, title }) => (
  <div className={styles.mediaItem}>
    <h3>{title}</h3>
    <div className={styles.actions}>
      <button>Approve</button>
      <button>Flag</button>
      <button>Categorize</button>
    </div>
    <div className={styles.icon}>
      {type === 'video' && <span>🎥</span>}
      {type === 'article' && <span>📄</span>}
      {type === 'audio' && <span>🎧</span>}
    </div>
  </div>
);

export default Dashboard;*/
import React from 'react';
import styles from '../style.css/Dashboard.module.css';

const StudentDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <h1>Student Dashboard</h1>
      <nav>
        <ul>
          <li>Profile</li>
          <li>Categories</li>
          <li>My Content</li>
          <li>Subscriptions</li>
        </ul>
      </nav>
      <section className={styles.topArticles}>
        <h2>Top Articles</h2>
      </section>
      <section className={styles.content}>
        <h2>Videos</h2>
      </section>
      <section className={styles.content}>
        <h2>Audios</h2>
      </section>
      <section className={styles.content}>
        <h2>Articles</h2>
      </section>
    </div>
  );
};

export default StudentDashboard;
