import React, { useState } from 'react';
import { storage, ref, uploadBytesResumable, firestore, getDownloadURL } from './firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
  };

  const handleTitleChange = (e) => {
    setVideoTitle(e.target.value);
  };

  const handleUpload = async () => {
    try {
      if (!videoFile || !thumbnailFile || !videoTitle) {
        alert('Please select a video file, a thumbnail, and provide a title.');
        return;
      }

      const videoStorageRef = ref(storage, `${videoTitle}_video.mp4`);
      const videoUploadTask = uploadBytesResumable(videoStorageRef, videoFile);

      const thumbnailStorageRef = ref(storage, `${videoTitle}_thumbnail.jpg`);
      const thumbnailUploadTask = uploadBytesResumable(thumbnailStorageRef, thumbnailFile);

     
      videoUploadTask.on('state_changed',
        (snapshot) => {
        
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error during video upload:', error);
        },
        async () => {
          
          const videoDownloadURL = await getDownloadURL(videoUploadTask.snapshot.ref);
          const thumbnailDownloadURL = await getDownloadURL(thumbnailUploadTask.snapshot.ref);

          const videoDocRef = await addDoc(collection(firestore, 'videos'), {
            title: videoTitle,
            url: videoDownloadURL,
            thumbnailUrl: thumbnailDownloadURL,
            timestamp: serverTimestamp(),
            likes: 0,
          });

          console.log('Video uploaded successfully! Document ID:', videoDocRef.id);
          navigate("/");

        }
      );
    } catch (error) {
      console.error('Error during upload and Firestore update:', error);
      alert('Error during upload and Firestore update. Please try again.');
    }
  };

  return (
    <div className='container'>
      <h2>Upload Video</h2>
      <label className='form-control'>
        Video Title:
        <input type="text" value={videoTitle} onChange={handleTitleChange} className='video-title input-control'  />
      </label>
      <br />
      <label className='form-control'>
        Select Video File:
        <input type="file" accept="video/*" onChange={handleVideoFileChange} className='input-control'/>
      </label>
      <br />
      <label>
        Select Thumbnail:
        <input type="file" accept="image/*" onChange={handleThumbnailFileChange} className='input-control'/>
      </label>
      <br />
      <progress value={uploadProgress} max="100"></progress>
      <br />
      <button className='btn btn-success' onClick={handleUpload}>Upload Video</button>
    </div>
  );
};

export default VideoUpload;
