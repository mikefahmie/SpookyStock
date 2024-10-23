// Navbar.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <Authenticator>
      {({ signOut }) => (
        <header className="sticky top-0 bg-white shadow-sm z-50">
          <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-indigo-600">
              <img
                src="https://gvscholarship.org/wp-content/uploads/2024/10/SpookyStock.jpg"
                alt="SpookyStock"
                className="w-auto h-10"
              />
            </Link>

            {/* Hamburger Menu */}
            <div className="hamburger-menu">
              <button onClick={toggleMenu} className="focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                  />
                </svg>
              </button>
            </div>

            {/* Overlay Menu */}
            {showMenu && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                <div className="flex flex-col items-center bg-white p-8 rounded-lg space-y-4">
                  <Link to="/categories" className="text-2xl font-bold text-gray-800 hover:text-indigo-600" onClick={toggleMenu}>
                    Categories
                  </Link>
                  <Link to="/bins" className="text-2xl font-bold text-gray-800 hover:text-indigo-600" onClick={toggleMenu}>
                    Bins
                  </Link>
                  <Link to="/items" className="text-2xl font-bold text-gray-800 hover:text-indigo-600" onClick={toggleMenu}>
                    Items
                  </Link>
                  <button onClick={signOut} className="text-2xl font-bold text-white-600 hover:text-white-800">
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
      )}
    </Authenticator>
  );
};

export default Navbar;
