import React, { useEffect, useState } from 'react';


function VideoInput() {
  const [filePath, setFilePath] = useState('');
  const [message, setMessage] = useState('');

  // Handle file selection via input
  const handleFileSelect = (event) => {

    


    console.log('Absolute Path:', filePath);
    window.electron.ipcRenderer.send('file-selected', filePath);
  };
  useEffect(() => {
    window.electron.ipcRenderer.on('file-selected', (event, data) => {
      console.log(data.message);
      setMessage(data.message);
    });
  }
  , []);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div className="btn btn-outline w-100">
    
    <input
      type="text"
      value={filePath}
      onChange={(e) => setFilePath(e.target.value)}
      name='videoFile'
      placeholder='C:/Users/username/Videos/video.mp4'
      className="block w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
    />
    
    <button
      className="btn btn-dark "
      onClick={() => handleFileSelect(filePath)}
    >Run</button>
    
  </div>
  {message && (
      <p className="mt-2 text-gray-600">STATUS: {message}</p>
    )}
    </div>
  );
}

export default VideoInput;