import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { auth } from './firebase';
import './Navbar.css';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import prof from '../profileImage.jpg';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  const isAllowedUser = user && user.email === 'khothatsoramotholo@gmail.com';

  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary"'>
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src={prof} alt='prof' className='logo-image'/>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className='navbar-nav  ms-auto mb-2 mb-lg-0'>
            <li className='nav-item'>
              <NavLink to="/" activeclassname="active" className="nav-link">
                <VideoLibraryIcon fontSize="large" className="me-2" />
                <span className="nav-item-text">Videos</span>
              </NavLink>

            </li>
            {isAllowedUser && (
              <>
                <li className='nav-item'>
                  <NavLink to="/upload" activeclassname="active" className="nav-link">
                    <CloudUploadIcon fontSize="large" className="me-2" />
                    <span className="nav-item-text">upload</span>
                  </NavLink>
                </li>

              </>
            )}
            {!user && (
              <li className='nav-item'>
                <NavLink to="/login" activeclassname="active" className="nav-link">
                  Sign In
                </NavLink>
              </li>
            )}
            {user && (
              <li className='nav-item'>
                <button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
