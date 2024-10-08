import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  signOut?: () => void;
  user?: {
    username: string;
  };
}

const Navigation: React.FC<NavigationProps> = ({ signOut, user }) => {
  return (
    <nav className="bg-purple-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Spookystock</div>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-200">Categories</Link>
          <Link to="/bins" className="text-white hover:text-gray-200">Bins</Link>
          <Link to="/items" className="text-white hover:text-gray-200">Items</Link>
          <Link to="/search" className="text-white hover:text-gray-200">Search</Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-white">{user?.username}</span>
          {signOut && (
            <button onClick={signOut} className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-gray-100">
              Sign out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;