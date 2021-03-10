import React, { useState, useEffect, useRef, useContext } from 'react';
import { PhotogramContext } from '../contexts/PhotogramContext';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import CreatePost from './CreatePost';
import UpdateProfile from './UpdateProfile';
import LoginForm from './LoginForm';
import logo from '../assets/images/photogram-logo.svg';
import heartRed from '../assets/images/heart-red.svg';
import heartEmpty from '../assets/images/heart-empty.svg';
import house from '../assets/images/house.svg';
import compass from '../assets/images/compass.svg';
import defaultProfPic from '../assets/images/img-avatar.png';
import '../assets/css/navbar.css';
import '../assets/css/viewProfile.css';

/* 
  TO-DO:
    - Search Bar implementation
    - Notifications implementation
*/

const Navbar = () => {
  const [ createPost, setCreatePost ] = useState(false);
  const [ updateProfile, setUpdateProfile ] = useState(false);
  const [ login, setLogin ] = useState(false);
  const [ heart, setHeart ] = useState(true);
  const profileRef = useRef();
  const profileButtonRef = useRef();
  const notificationsRef = useRef();
  const notificationsButtonRef = useRef();
  const { user } = useContext(PhotogramContext);

  useEffect(() => {
    if (user) {
      document.addEventListener("mousedown", closeProfilePanel);
      document.addEventListener("mousedown", closeNotificationsPanel);
    }
    return () => {
      document.removeEventListener("mousedown", closeProfilePanel);
      document.removeEventListener("mousedown", closeNotificationsPanel);
    };
  }, [user]);

  const closeProfilePanel = e => {
    if (profileRef.current.contains(e.target) || profileButtonRef.current.contains(e.target)) return;
    document.getElementById('profile-panel').style.display = 'none';
  };

  const closeNotificationsPanel = e => {
    if (notificationsRef.current.contains(e.target) || notificationsButtonRef.current.contains(e.target)) return;
    document.getElementById('notifications-panel').style.display = 'none';
  };

  const handleNotifications = () => {
    if (heart)
      setHeart(false);
    const notificationsPanel = document.getElementById('notifications-panel');
    notificationsPanel.style.display == 'none' ? notificationsPanel.style.display = 'block' : notificationsPanel.style.display = 'none'
  };

  const toggleProfile = () => {
    const profPanel = document.getElementById('profile-panel');
    profPanel.style.display == 'none' ? profPanel.style.display = 'block' : profPanel.style.display = 'none';
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleCreatePost = () => {
    document.getElementById('profile-panel').style.display = 'none';
    setCreatePost(prev => !prev);
  };

  const handleUpdateProfile = () => {
    document.getElementById('profile-panel').style.display = 'none';
    setUpdateProfile(prev => !prev);
  };

  return (
    <>
    <div className="nav-container">
      <nav>
        <div className="logo"><Link to="/"><img src={logo} alt="Photogram logo"/></Link></div>
        <input className = "search-bar" type="search" placeholder="&#x26B2; Search" aria-label="Search" />
        

        { user ?
        <div className="nav-icons">
          <ul className="nav-button-container">
            <li className="button-li"><Link to="/"><img src={house} className="nav-button" style={{height: '25px', width: '25px'}} /></Link></li>
            <li className="button-li"><Link to="/"><img src={compass} className="nav-button" style={{height: '25px', width: '25px'}} /></Link></li>

            <li className="button-li" ref={notificationsButtonRef}>
              { !heart ? 
                <img src={heartEmpty} className="nav-button" onClick={handleNotifications} style={{height: '25px', width: '25px'}} /> :
                <img src={heartRed} className="nav-button" onClick={handleNotifications} style={{height: '25px', width: '25px'}} />
              }
            </li>
            <div className="notifications-panel" id="notifications-panel" ref={notificationsRef} style={{ display: 'none'}}>
              In development: Here you will see recent activity on your Photogram page, including new followers, photo likes, and comments.
            </div>
            <li className="button-li"><img className="nav-button profile-pic" src={user.profIcon || defaultProfPic} ref={profileButtonRef} style={{height: '28px', width: '28px'}} onClick={toggleProfile} /></li>
            <div className="profile-panel" id="profile-panel" ref={profileRef} style={{display: 'none'}}>
              <ul className="profile-tabs">
                <li className="profile-tab-li" onClick={handleCreatePost}>Create New Post</li>
                <li className="profile-tab-li" onClick={handleUpdateProfile}>Edit Profile</li>
                <li className="profile-tab-li" onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          </ul>
        </div> :
        <div className="nav-icons">
          <ul className="nav-button-container">
            <li className="button-li blue-btn" onClick={() => setLogin(prev => !prev)}>Log In</li>
            <li className="button-li blue-text" onClick={() => setLogin(prev => !prev)}>Sign Up</li>
          </ul>
        </div>
        }


      </nav>
    </div>
      <Modal showModal={createPost} setShowModal={setCreatePost} includeCloseBtn>
        <CreatePost />
      </Modal>
      <Modal showModal={updateProfile} setShowModal={setUpdateProfile} includeCloseBtn>
        <UpdateProfile />
      </Modal>
      <Modal showModal={login} setShowModal={setLogin} includeCloseBtn>
        <LoginForm setLogin={setLogin} />
      </Modal>
    </>
  );
};

export default Navbar;