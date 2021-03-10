import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const PhotogramContext = createContext(null);

const PhotogramProvider = ({ children }) => {
  const [ user, setUser ] = useState(null);
  const [ token, setToken ] = useState(null);
  const [ allPosts, setAllPosts ] = useState(null);
  const [ allUsers, setAllUsers ] = useState(null);
  const [ usersFollowed, setUsersFollowed ] = useState(null);

  useEffect(() => {
    if(localStorage.getItem('userId')) {
      getUser(localStorage.getItem('userId'));
      setToken(localStorage.getItem('token'));
    }
    getAllUsersAndPosts();
  }, []);

  const getAllUsersAndPosts = () => {
    axios.all([
      axios.get(`${process.env.REACT_APP_BASE_URL}posts/`),
      axios.get(`${process.env.REACT_APP_BASE_URL}users/`)
    ])
      .then(res => {
        setAllPosts(res[0].data.reverse());
        setAllUsers(res[1].data.reverse());
      })
      .catch(error => {
        console.log("An error has occurred");
      })
  };

  const getUser = (userId) => {
    axios.get(`${process.env.REACT_APP_BASE_URL}users/id/${userId}`)
      .then(res => {
        setUser(res.data);
        setUsersFollowed(res.data.following);
      })
      .catch(error => {
        console.log("An error has occurred")
      });
  };

  return(
    <PhotogramContext.Provider value={{
      user, setUser,
      token, setToken,
      allPosts, setAllPosts,
      allUsers, setAllUsers,
      usersFollowed, setUsersFollowed
    }}>
      {children}
    </PhotogramContext.Provider>
  );
};

export default PhotogramProvider;