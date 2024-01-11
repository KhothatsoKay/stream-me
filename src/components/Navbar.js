import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav>
      <h2>Logo</h2>
      <ul>
        <li>
          <NavLink to="/" activeClassName="active" className="nav-link">
            Videos
          </NavLink>
        </li>
        <li>
          <NavLink to="/upload" activeClassName="active" className="nav-link">
            Upload
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
