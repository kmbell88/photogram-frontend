import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { PhotogramContext } from '../contexts/PhotogramContext';

export const PostContext = createContext();

const PostProvider = ({ postId, children }) => {
  const { user } = useContext(PhotogramContext);
  const [ post, setPost ] = useState(null);
  const [ postLikes, setPostLikes ] = useState(null);
  const [ comments, setComments ] = useState(null);
  const [ bookmarked, setBookmarked ] = useState(false);
  const [ liked, setLiked ] = useState(false);
  const [ newComment, setNewComment ] = useState("");

  useEffect(() => {
    if(!post || post._id !== postId)
      getPost();
    if (post && user) {
      setBookmarked(user.bookmarks.some(bookmark => bookmark === post._id));
      setLiked(post.likes.some(like => like._id === user._id));
    }
  }, [post, user, postId]);

  const getPost = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}posts/${postId}`)
      .then(res => {
        setPost(res.data);
        setPostLikes(res.data.likes.reverse());
        setComments(res.data.comments);
      })
      .catch(error => {
        console.log("An error has occurred");
      })
  }

  const handleComment = () => {
    if (!user) {
      alert('Please login or register to comment');
      return;
    }
    const form = {
      comment: newComment,
      userId: user._id,
      postId: post._id
    };

    axios.patch(`${process.env.REACT_APP_BASE_URL}posts/addComment`, form)
    .then(res => {
      let pushComment = {
        comment: newComment,
        commentBy: user._id
      }
      setComments(oldComments => [...oldComments, pushComment]);
      setNewComment("");
    })
    .catch()
  };

  const handleLike = () => {
    if (!user) {
      alert('Please login or register to like');
      return;
    }
    const notification = {
      user: user._id,
      regarding: "Like",
      postId: post._id
    };

    axios.patch(`${process.env.REACT_APP_BASE_URL}posts/likePost`, {
      userId: user._id,
      postId: post._id,
      postAuthorId: post.postBody.postedBy._id,
      notification: notification
    })
    .then(res => {
      setLiked(!liked);
      if (!liked) {
        let pushUser = { _id: user._id, username: user.username, profIcon: user.profIcon };
        setPostLikes([...postLikes, pushUser]);
      }
      else
        setPostLikes(oldPostLikes => oldPostLikes.filter(like => like._id !== user._id));
    })
    .catch(error => console.log(error));
  }

  const handleBookmark = () => {
    if (!user) {
      alert('Please login or register to bookmark');
      return;
    }
    axios.patch(`${process.env.REACT_APP_BASE_URL}users/updateBookmark`, {
      userId: user._id,
      postId: post._id,
    })
    .then(res => {
      setBookmarked(!bookmarked);
     })
    .catch(error => console.log(error));
  }

  const getDatePosted = () => {
    const [ postYear, postMonth, postDate, postTime ] = post.postBody.created_at.split('-');
    const [ todaysDay, todaysMonth, todaysDate, todaysYear, todaysTime ] = Date(Date.now()).split(" ");
    let fullMonth;

    switch(postMonth) {
      case "01":
        fullMonth = "January";
        break;
      case "02":
        fullMonth = "February";
        break;
      case "03":
        fullMonth = "March";
        break;
      case "04":
        fullMonth = "April";
        break;
      case "05":
        break;
      case "06":
        fullMonth = "June";
        break;
      case "07":
        fullMonth = "July";
        break;
      case "08":
        fullMonth = "August";
        break;
      case "09":
        fullMonth = "September";
        break;
      case "10":
        fullMonth = "October";
        break;
      case "11":
        fullMonth = "November";
        break;
      case "12":
        fullMonth = "December";
        break;
      default:
        fullMonth = "Error";
    }

    if (todaysYear === postYear)
      return `${fullMonth} ${postDate[0] + postDate[1]}`
    else
      return `${fullMonth} ${postDate[0] + postDate[1]}, ${postYear}`
  }

  return(
    <PostContext.Provider value={{
      post, setPost,
      postLikes, setPostLikes,
      comments, setComments,
      bookmarked, setBookmarked,
      liked, setLiked,
      newComment, setNewComment,
      handleLike, handleComment, handleBookmark,
      getDatePosted
    }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;

