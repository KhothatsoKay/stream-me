
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';
import './VideoList.css';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';

import VideoDisplay from './VideoDisplay';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosCollection = collection(firestore, 'videos');
        const querySnapshot = await getDocs(videosCollection);

        const videoData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setVideos(videoData);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const handleThumbnailClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="video-container">
      {selectedVideo ? (
        <div className="video-modal" onClick={handleCloseModal}>
          <VideoDisplay videoUrl={selectedVideo.url} videoTitle={selectedVideo.title} />
          <button className='btn btn-warning' onClick={handleCloseModal}>Close</button>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <div key={video.id} className="card video-thumbnail" onClick={() => handleThumbnailClick(video)}>
              <img src={video.thumbnailUrl} alt={video.title} />
              <div className="card-text">
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;
