import React, { useState, useEffect, useRef } from 'react';
import Cropper from 'cropperjs';
import axios from 'axios';
import "cropperjs/dist/cropper.min.css";
import '../assets/css/cropper.css';
import uploadPlaceholder from '../assets/images/upload-image-placeholder.svg';
import base64ImageToBlob from '../assets/js/base64-to-blob';

const CreateProfilePic = () => {
  const [{alt, src}, setImage] = useState({
    src: null,
    alt: 'Upload an Image'
  });
  const [imageDestination, setImageDestination] = useState("");
  const imageElement = useRef(null);

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
    let url = `${process.env.REACT_APP_HEROKU}users/updatePic`
    let blob = base64ImageToBlob(imageDestination);
    let imgFile = new File([blob], alt, {
      type: "image/jpeg",
      lastModified: new Date(),
      size: 2
    });

    let formData = new FormData();
    formData.append("postImg", imgFile);
    formData.append("userId", "601a046e088bdf56ad7ea9df");

    axios.post(url, formData,
      {
        headers: {
          "Content-type": "multipart/form-data"
        }
      }
    )
    .then(res => {
      setImageDestination("");
      setImage({ alt: null, src: null });
      imageElement.current = null;
    })
    .catch(error => {
      console.log(error);
    });
  }

  return(
    <div className="update-profile-pic-container">
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
        <img ref={imageElement} src={src} alt="Source" />
      </div>
      <div className="post-publish-fields">
        <img className="img-preview" src={imageDestination} alt="Destination" />
        <button className="button" onClick={publishPost}>Update Picture</button>
      </div>
      </>
      }
    </div>
  );
}

export default CreateProfilePic;