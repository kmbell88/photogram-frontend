import React, { useState, useEffect, useContext } from 'react';
import { PhotogramContext} from '../contexts/PhotogramContext';
import CreateProfilePic from './CreateProfilePic';
import axios from 'axios';
import '../assets/css/editProfile.css';

const UpdateProfile = () => {
  const [ selection, setSelection ] = useState('profPic');
  const { user } = useContext(PhotogramContext);

  return (
    <div className="edit-profile">
      <div className="edit-profile__left">
        <ul>
          <li className="edit-profile__left__li" onClick={() => setSelection('profPicture')}>New Profile Picture</li>
          <li className="edit-profile__left__li" onClick={() => setSelection('username')}>Update Username</li>
          <li className="edit-profile__left__li" onClick={() => setSelection('displayName')}>Update Display Name</li>
          <li className="edit-profile__left__li" onClick={() => setSelection('description')}>Update Profile Description</li>
        </ul>
      </div>
      <div className="edit-profile__right">
        { user && <>
        { selection === 'profPicture'  && <CreateProfilePic user={ user } /> }
        { selection === 'username'    && <UpdateUsername user={ user } /> }
        { selection === 'displayName' && <UpdateDisplayName user={ user } /> }
        { selection === 'description' && <UpdateDescription user={ user } /> }
        </>}
      </div>
    </div>
  );
};

const UpdateUsername = ({ user }) => {
  const [ username, setUsername ] = useState("");
  
  useEffect(() => {
    let usernameEl = document.getElementById('update-username');
    if(username.toLowerCase() === user.username.toLowerCase())
      usernameEl.style.border = 'solid 2px #77dd77';
    else
      usernameEl.style.border = 'solid 2px #eeeeee';
  }, [username]);

  function handleUsername() {
    if(username.toLowerCase() !== user.username.toLowerCase()) {
      console.log("Usernames do not match");
      return;
    }
    axios.patch(`${process.env.REACT_APP_HEROKU}users/updateUsername`, { username: username, userId: user._id})
      .then(res => {
        setUsername("");
      })
      .catch(error => {
        console.log("Error");
      })
  }

  return(
    <div className="edit-profile__username">
      <h3>Update Username Casing</h3>
      <p>You may change the casing of your username however you'd like. <br />A green box will appear when the updated name is valid.</p>
      <input
        className="login-form-input"
        type="text"
        value={username}
        id="update-username"
        placeholder="Update casing of you username..."
        onChange={text => setUsername(text.target.value)}
        required
      />
      <button onClick={handleUsername}>Update</button>
    </div>
  )
};

const UpdateDisplayName = ({ user }) => {
  const [ displayName, setDisplayName ] = useState("");

  function handleDisplayName() {
    axios.patch(`${process.env.REACT_APP_HEROKU}users/updateDisplayName`, { displayName: displayName, userId: user._id})
      .then(res => {
        setDisplayName("");
      })
      .catch(error => {
        console.log("Error");
      })
  }

  return(
    <div className="edit-profile__display-name">
      <h3>Update Display Name</h3>
      <p>You may put your full name or preferred name here.</p>
      <input
        className="login-form-input"
        type="text"
        value={displayName}
        id="update-displayName"
        placeholder="Add a description about yourself..."
        onChange={text => setDisplayName(text.target.value)}
        required
      />
      <button onClick={handleDisplayName}>Update</button>
    </div>
  )
};

const UpdatePassword = ({ user }) => {
  const [ oldPassword, setOldPassword ] = useState("");
  const [ newPassword, setNewPassword ] = useState("");
  const [ confirmNewPW, setConfirmNewPW ] = useState("");

  useEffect(() => {
    let passwordEl = document.getElementById('update-new-password');
    let passwordConfirmEl = document.getElementById('update-confirm-pw');

    if (confirmNewPW === "") {
      passwordEl.style.border = 'solid 2px #eeeeee';
      passwordConfirmEl.style.border = 'solid 2px #eeeeee';
    } else if (newPassword !== confirmNewPW) {
      passwordEl.style.border = 'solid 2px #ff474c';
      passwordConfirmEl.style.border = 'solid 2px #ff474c';
    } else {
      passwordEl.style.border = 'solid 2px #77dd77';
      passwordConfirmEl.style.border = 'solid 2px #77dd77';      
    }
  }, [newPassword, confirmNewPW]);

  function handlePassword() {
    console.log('clicked')
    axios.patch(`${process.env.REACT_APP_HEROKU}users/updatePassword`, { oldPassword: oldPassword, newPassword: newPassword, userId: user._id })
      .then(res => {
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPW("");
      })
      .catch(error => {
        console.log("Error");
      })
  }

  return(
    <div className="edit-profile__password">
      <input
        className="login-form-input"
        type="password"
        value={oldPassword}
        placeholder="Current password"
        onChange={text => setOldPassword(text.target.value)}
        required
      />
      <input
        className="login-form-input"
        type="password"
        value={newPassword}
        id="update-new-password"
        placeholder="New password"
        onChange={text => setNewPassword(text.target.value)}
        required
      />
      <input
        className="login-form-input"
        type="password"
        value={confirmNewPW}
        id="update-confirm-pw"
        placeholder="Confirm new password"
        onChange={text => setConfirmNewPW(text.target.value)}
        required
      />
      <button onClick={handlePassword}>Update</button>
    </div>
  )
};

const UpdateDescription = ({ user }) => {
  const [ description, setDescription ] = useState("");

  function handleUpdateDescription() {
    axios.patch(`${process.env.REACT_APP_HEROKU}users/updateDescription`, { description: description, userId: user._id })
      .then(res => {
        setDescription("");
      })
      .catch(error => {
        console.log("An error has occurred");
      });
  }

  return(
    <div>
      <h3>Update Profile Description</h3>
      <p>Here you can write a short bio to tell users a little about you.</p>
      <textarea
        className="login-form-input"
        type="text"
        value={description}
        placeholder="Add a description about yourself..."
        onChange={text => setDescription(text.target.value)}
        required
      />
      <button onClick={handleUpdateDescription}>Update</button>
    </div>
  )
};

const DeactivateAccount = ({ user }) => {
  function handleDeactivateAccount() {
    axios.patch(`${process.env.REACT_APP_HEROKU}users/deactivate`, { active: false })
    .then(res => {
      // Destroy localstorage, re-route to deactivated page.
    })
    .catch(err => {
      console.log("An error has occurred");
    });
  }

  return(
    <div className="edit-profile__deactivate">
      
    </div>
  )
};

export default UpdateProfile;
