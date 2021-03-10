import React, { useState, useEffect, useRef, useContext } from 'react';
import { PhotogramContext } from '../contexts/PhotogramContext';
import Cropper from 'cropperjs';
import axios from 'axios';
import "cropperjs/dist/cropper.min.css";
import '../assets/css/cropper.css';
import uploadPlaceholder from '../assets/images/upload-image-placeholder.svg';
import base64ImageToBlob from '../assets/js/base64-to-blob';

const CreatePost = () => {
  const [{alt, src}, setImage] = useState({
    src: null,
    alt: 'Upload an Image'
  });
  const [description, setDescription] = useState("");
  const [imageDestination, setImageDestination] = useState("");
  const imageElement = useRef(null);
  const { user } = useContext(PhotogramContext);

  const handleImg = e => {
    if (e.target.files[0]) {
      setImage({
        src: URL.createObjectURL(e.target.files[0]),
        alt: e.target.files[0].name
      });
    }
  }

  useEffect(() => {
    if (src != null) {
      const cropper = new Cropper(imageElement.current, {
        zoomable: false,
        scalable: false,
        aspectRatio: 1/1,
        crop: () => {
          const canvas = cropper.getCroppedCanvas();
          setImageDestination(canvas.toDataURL("image/jpeg"));
        }
      });
    }
  });

  const publishPost = () => {
    let url = `${process.env.REACT_APP_HEROKU}posts/createPost`
    let blob = base64ImageToBlob(imageDestination);
    let imgFile = new File([blob], alt, {
      type: "image/jpeg",
      lastModified: new Date(),
      size: 2
    });

    let formData = new FormData();
    formData.append("postImg", imgFile);
    formData.append("text", description);
    formData.append("userId", user._id);

    axios.post(url, formData,
      {
        headers: {
          "Content-type": "multipart/form-data"
        }
      }
    )
    .then(res => {
      setDescription("");
      setImageDestination("");
      setImage({ alt: null, src: null });
      imageElement.current = null;
    })
    .catch(error => {
      console.log(error);
    });
  }

  return(
    <div className="create-post-container">
      { src == null && 
      <div className="upload-image-view">
      <img src={uploadPlaceholder} style={{width: '320px', height: 'auto'}} />
      <input
        type="file"
        accept=".png, .jpg, .jpeg"
        id="photo"
        onChange={handleImg}
      />
      <label className="button" htmlFor="photo">Add a Photo</label>
      </div>
      }
      {src != null &&
      <>
      <div className="post-img-container">
        <img className="post-img-container__img" ref={imageElement} src={src} alt="Source" />
      </div>
      <div className="post-publish-fields">
        <textarea
          className="publish-textarea"
          value={description}
          placeholder="Add a description to your photo..."
          rows="4"
          onChange={desc => setDescription(desc.target.value)}
        />
        <button className="button" onClick={publishPost}>Publish Post</button>
      </div>
      </>
      }
    </div>
  );
}

export default CreatePost;