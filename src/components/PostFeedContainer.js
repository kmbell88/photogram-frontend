import React, { useContext, useState, useEffect } from 'react';
import { PhotogramContext } from '../contexts/PhotogramContext';
import DisplayPostPortrait from '../components/DisplayPostPortrait';
import PostProvider from '../contexts/PostContext';

const PostFeedContainer = ({ filter }) => {
  const [ filteredPosts, setFilteredPosts ] = useState(null);
  const { user, allPosts, allUsers } = useContext(PhotogramContext);

  useEffect(() => {
    if (user && filter === "bookmarked") {
      setFilteredPosts(
        user.bookmarks.forEach(bookmark => {
          allPosts.find(post => post._id === bookmark);
        })
      );
    }
    else if (user && filter === "following") {
      setFilteredPosts(
        allPosts
      );
    }
    else
      setFilteredPosts(allPosts);
  }, [user, allPosts, allUsers]);

  return (
    <div className="posts-container">
      { filteredPosts && allUsers &&
        filteredPosts.map(post => {
          return (
            <PostProvider key={post._id} postId={post._id}>
              <DisplayPostPortrait />
            </PostProvider>
          );
        }) 
      }
    </div>
  );
};

export default PostFeedContainer;