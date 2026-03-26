import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
    setLoggingOut(false);
  };

  const getUserInitial = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName[0].toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    return currentUser?.email;
  };

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">₹</span>
          </div>
          <h2 className="text-base font-bold text-gray-800">
            Budget Tracker
          </h2>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/dashboard')
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </Link>
          
          {/* Analytics Link - ADD THIS */}
          <Link
            to="/analytics"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/analytics')
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Analytics
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-700">
                {getDisplayName()}
              </span>
              {currentUser?.displayName && (
                <span className="text-xs text-gray-400">
                  {currentUser.email}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-semibold">
                  {getUserInitial()}
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;