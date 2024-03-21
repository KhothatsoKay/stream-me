import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';
import './VideoList.css';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import VideoDisplay from './VideoDisplay';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [uniquePlaylists, setUniquePlaylists] = useState([]);

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
        
        const playlists = [...new Set(videoData.map(video => video.playList))];
        setUniquePlaylists(['All', ...playlists]); 
        
        console.log("Unique Playlists:", playlists);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const handlePlaylistFilter = (playlistName) => {
    setSelectedPlaylist(playlistName === 'All' ? null : playlistName);
  };
  
  const handleThumbnailClick = (e, video) => {
    e.stopPropagation();
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const filteredVideos = selectedPlaylist ? videos.filter(video => video.playList === selectedPlaylist) : videos;
  console.log("filtered Playlist:", filteredVideos);
  return (
    <div className="container">
      <div className="header">
        <div className="playlist-buttons">
          {uniquePlaylists.map((playlist, index) => (
            <button key={index} className="btn playlist-btn" onClick={() => handlePlaylistFilter(playlist)}>
              {playlist}
            </button>
          ))}
        </div>
      </div>
      <div className="video-container">
        {selectedVideo ? (
          <div className="video-modal">
            <VideoDisplay videoId={selectedVideo.id} videoUrl={selectedVideo.url} videoTitle={selectedVideo.title} />
            <ArrowBackIosIcon className='close' onClick={(e) => { e.stopPropagation(); handleCloseModal(); }}/>
          </div>
        ) : (
          <div className="video-grid">
            {filteredVideos.map((video) => (
              <div key={video.id} className="video-container" onClick={(e) => handleThumbnailClick(e, video)}>
                <div className="video-thumbnail">
                  <img src={video.thumbnailUrl} alt={video.title} />
                  </div>
                <div className="card-body">
                  <p>{video.title}</p>
                  <span className="video-date"></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoList;
