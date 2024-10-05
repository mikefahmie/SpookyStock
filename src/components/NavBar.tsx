import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';

interface NavBarProps {
  onSignOut: () => void;
  user: any;
}

const NavBar: React.FC<NavBarProps> = ({ onSignOut, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">Spookystock</div>
      <div className="menu-icon" onClick={toggleMenu}>
        <FaBars />
      </div>
      <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <button onClick={() => {
          if (user) {
            onSignOut();
          }
          toggleMenu();
        }}>
          {user ? 'Sign Out' : 'Sign In'}
        </button>
        <button onClick={toggleMenu}>Bins</button>
      </div>
    </nav>
  );
};

export default NavBar;