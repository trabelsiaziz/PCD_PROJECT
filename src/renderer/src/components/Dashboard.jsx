import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Server } from 'lucide-react';
import Offline from './Offline';

const Dashboard = () => {
  const { currentUser, isOnline, toggleOnlineStatus, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    toggleOnlineStatus();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <Server className="header-icon" />
            <h1>Server Control</h1>
          </div>
          <button onClick={handleLogout} className="btn btn-danger">
            <LogOut className="icon" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="welcome-section">
            <h2>Welcome, {currentUser?.user || 'User'}</h2>
            <p className="status-message">
              {isOnline 
                ? 'System is online and ready for server operations.' 
                : 'System is currently offline. Please wait while we connect...'}
            </p>
          </div>
          
          {isOnline && <Offline />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;