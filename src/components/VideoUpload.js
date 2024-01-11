import React, { useState } from 'react';
import { auth, storage, ref, uploadBytesResumable, firestore, getDownloadURL } from './firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');

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

      // Upload video file
      const videoStorageRef = ref(storage, `${videoTitle}_video.mp4`);
      const videoUploadTask = uploadBytesResumable(videoStorageRef, videoFile);

      // Upload thumbnail file
      const thumbnailStorageRef = ref(storage, `${videoTitle}_thumbnail.jpg`);
      const thumbnailUploadTask = uploadBytesResumable(thumbnailStorageRef, thumbnailFile);

      // Wait for both uploads to complete
      await Promise.all([videoUploadTask, thumbnailUploadTask]);

      // Get download URLs
      const videoDownloadURL = await getDownloadURL(videoUploadTask.snapshot.ref);
      const thumbnailDownloadURL = await getDownloadURL(thumbnailUploadTask.snapshot.ref);

      // Add video details to Firestore
      const videoDocRef = await addDoc(collection(firestore, 'videos'), {
        title: videoTitle,
        url: videoDownloadURL,
        thumbnailUrl: thumbnailDownloadURL,
        timestamp: serverTimestamp(),
      });

      console.log('Video uploaded successfully! Document ID:', videoDocRef.id);
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
      <button className='btn btn-success' onClick={handleUpload}>Upload Video</button>
    </div>
  );
};

export default VideoUpload;
