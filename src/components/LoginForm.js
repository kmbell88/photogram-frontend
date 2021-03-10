import React, { useState, useEffect, useContext } from 'react';
import { PhotogramContext } from '../contexts/PhotogramContext';
import axios from 'axios';
import logo from '../assets/images/photogram-logo.svg'
import '../assets/css/login.css';

const LoginForm = ({ setLogin }) => {
  const [ direction, setDirection ] = useState('left');

  useEffect(() => {
    let left = document.getElementById('selection-left');
    let right = document.getElementById('selection-right');

    if(direction == 'left') {
      left.style.borderBottom = "2px solid #1e90ff";
      right.style.borderBottom = null;
    } else {
      left.style.borderBottom = null;
      right.style.borderBottom = "2px solid #1e90ff";
    }
  }, [ direction ]);

  return(
    <div className="login-form-container">
      <img className="login-logo" src={logo} alt="Photogram Logo" />
      <div className="login-selector">
        <div className="login-selection" id="selection-left" onClick={() => setDirection('left')}>Login</div>
        <div className="login-selection" id="selection-right" onClick={() => setDirection('right')}>Register</div>
      </div>
      { direction === 'left' && <Login setLogin={setLogin} /> }
      { direction === 'right' && <Register setLogin={setLogin} /> }
    </div>
  );
};

const Login = ({ setLogin }) => {
  const [ userLogin, setUserLogin ] = useState("");
  const [ userPassword, setUserPassword ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");
  const { setUser } = useContext(PhotogramContext);

  const handleLogin = (e) => {
    e.preventDefault();
    if (userLogin === "" || userPassword === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    axios.post(`${process.env.REACT_APP_HEROKU}users/login`, {
      username: userLogin,
      password: userPassword
    })
    .then(res => {
      localStorage.setItem('userId', res.data.user._id);
      localStorage.setItem('token', res.data.token);
      setErrorMessage("");
      setUserLogin("");
      setErrorMessage("");
      setUser(res.data.user);
      if (setLogin)
        setLogin(false);
    })
    .catch(error => {
      let errorMessage = error.response.data.error || "An unexpected error has occurred";
      setErrorMessage(errorMessage);
      console.log(error)
    });
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form">
        <label htmlFor="user-login">Username</label>
        <input
          className="login-form-input"
          type="text"
          value={userLogin}
          id="user-login"
          onChange={text => setUserLogin(text.target.value)}
          required
        />
        <label htmlFor="login-password">Password</label>
        <input
          className="login-form-input"
          type="password"
          value={userPassword}
          id="login-password"
          onChange={text => setUserPassword(text.target.value)}  
          required
        />
        <button className="login-button" onClick={e => handleLogin(e)}>Login</button>
      </form>
      { errorMessage && <div className="error-message">{errorMessage}</div> }
    </div>
  );
};

const Register = ({ setLogin }) => {
  const [ registerUser, setRegisterUser ] = useState("");
  const [ registerPW, setRegisterPW ] = useState("");
  const [ confirmRegisterPW, setConfirmRegisterPW ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");

  useEffect(() => {
    let passwordEl = document.getElementById('register-password');
    let passwordConfirmEl = document.getElementById('register-password-confirm');

    if (confirmRegisterPW === "") {
      passwordEl.style.border = 'solid 2px #eeeeee';
      passwordConfirmEl.style.border = 'solid 2px #eeeeee';
    } else if (confirmRegisterPW !== registerPW) {
      passwordEl.style.border = 'solid 2px #ff474c';
      passwordConfirmEl.style.border = 'solid 2px #ff474c';
    } else {
      passwordEl.style.border = 'solid 2px #77dd77';
      passwordConfirmEl.style.border = 'solid 2px #77dd77';      
    }
  }, [registerPW, confirmRegisterPW]);

  const handleRegistration = (e) => {
    e.preventDefault();
    if (registerPW !== confirmRegisterPW) {
      setErrorMessage("The passwords provided do not match");
      return;
    }
    axios.post(`${process.env.REACT_APP_HEROKU}users/register`, {
      username: registerUser,
      password: registerPW
    })
    .then(result => {
      setErrorMessage("");
      setRegisterUser("");
      setRegisterPW("")
      setConfirmRegisterPW("");
      if (setLogin) {
        setLogin(false);
      }
    })
    .catch(error => {
      let errorMessage = error.response.data.error || "An unexpected error has occurred";
      setErrorMessage(errorMessage);
    });
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form className="login-form">
        <label htmlFor="register-username">Username</label>
        <input
          className="login-form-input"
          type="text"
          value={registerUser}
          id="register-username"
          onChange={text => setRegisterUser(text.target.value)}
          required
        />
        <label htmlFor="register-password">Password</label>
        <input
          className="login-form-input"
          type="password"
          value={registerPW}
          id="register-password"
          onChange={text => setRegisterPW(text.target.value)}  
          required
        />
        <label htmlFor="register-password-confirm">Confirm Password</label>
        <input
          className="login-form-input"
          type="password"
          value={confirmRegisterPW}
          id="register-password-confirm"
          onChange={text => setConfirmRegisterPW(text.target.value)} 
          required
        />
        <button className="login-button" onClick={e => handleRegistration(e)}>Register</button>
        { errorMessage && <div className="error-message">{ errorMessage }</div> }
      </form>
    </div>
  );
};

export default LoginForm;
