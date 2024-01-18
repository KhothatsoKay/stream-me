import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { doc, getDoc, updateDoc, deleteDoc} from 'firebase/firestore';
import { firestore } from './firebase';
import { useNavigate } from 'react-router-dom';

const VideoDisplay = ({ videoId, videoUrl }) => {
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [likes, setLikes] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const setHeight = () => {
      setWrapperHeight(window.innerHeight);
    };
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, []);

  useEffect(() => {
    const fetchLikes = async () => {
      const videoRef = doc(firestore, 'videos', videoId);
      const videoDoc = await getDoc(videoRef);

      if (videoDoc.exists()) {
        const videoData = videoDoc.data();
        setLikes(videoData.likes || 0);
      }
    };

    fetchLikes();
  }, [videoId]);

 

  const handleLike = async (e) => {
    e.stopPropagation();
    const videoRef = doc(firestore, 'videos', videoId);

    await updateDoc(videoRef, {
      likes: likes + 1,
    });

    setLikes(likes + 1);
  };

  const handleDelete = async () => {
  
    if (window.confirm('Are you sure you want to delete this video?')) {
      console.log('Deleting...');
      const videoRef = doc(firestore, 'videos', videoId);
      
      try {
        await deleteDoc(videoRef);
        console.log('Video deleted successfully');
        navigate("/");

      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };
  


  return (
    <div className='player-wrapper' style={{ height: wrapperHeight }}>
      <ReactPlayer
        className='react-player'
        url={videoUrl}
        controls={true}
        width='100%'
        height='80%'
      />
      <div className='video-actions'>
        <button onClick={(e) => handleLike(e)} className='btn btn-outline-primary'>
          Like ({likes})
        </button>
        <button onClick={(e) => handleDelete(e)} className='btn btn-outline-danger'>
          Delete
        </button>

      </div>
    </div>
  );
};

export default VideoDisplay;
