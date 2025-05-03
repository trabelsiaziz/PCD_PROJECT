import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Play, Square, Loader, Wifi } from 'lucide-react';

const Offline = () => {
  const { isServerRunning, setServerRunning } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const[message, setMessage] = useState('');
  const [port, setPort] = useState();

  const startLocalServer = () => {
    setIsLoading(true);
    console.log('Local server started');
    
    
      window.electron.ipcRenderer.send('start-local-server');
      
    
  };
  useEffect(() => {
    window.electron.ipcRenderer.on('local-server-started', (event, data) => {
      console.log(data.message);
      setMessage(data.message);
      setPort(data.port);
      setServerRunning(true);
      setIsLoading(false);
    });
  }
  , []);

  const stopLocalServer = () => {
    setIsLoading(true);
    console.log('Local server stopped');
    
    setTimeout(() => {
      setServerRunning(false);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="card">
      <div className="server-header">
        <div className="server-title">
          <h3>Local Server Control</h3>
          <div className={`status-badge ${isServerRunning ? 'status-online' : 'status-offline'}`}>
            {isServerRunning ? 'Running' : 'Stopped'}
          </div>
        </div>
        <p className="server-description">
          {isServerRunning 
            ? 'Your local server is up and running. You can stop it anytime.' 
            : 'Start your local server to begin processing requests.'}
        </p>
      </div>
      
      <div className="server-controls">
        {!isServerRunning ? (
          <div className="button-group">
            <button
              onClick={startLocalServer}
              disabled={isLoading}
              className={`btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
            >
              {isLoading ? (
                <Loader className="icon spin-animation" />
              ) : (
                <Play className="icon" />
              )}
              Start Local Server
            </button>
            <button
              disabled
              className="btn btn-secondary btn-disabled"
              title="Online server feature coming soon!"
            >
              <Wifi className="icon" />
              Start Online Server
            </button>
          </div>
        ) : (
          <button
            onClick={stopLocalServer}
            disabled={isLoading}
            className={`btn btn-danger ${isLoading ? 'btn-loading' : ''}`}
          >
            {isLoading ? (
              <Loader className="icon spin-animation" />
            ) : (
              <Square className="icon" />
            )}
            Stop Server
          </button>
        )}
      </div>
      
      {isServerRunning && (
        <div className="server-logs">
          <h4>Server Logs</h4>
          <div className="logs-container">
            <div>Server initialized at {new Date().toLocaleTimeString()}</div>
            <div>Listening on port {port}</div>
            <div>message from server : {message}</div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Offline;