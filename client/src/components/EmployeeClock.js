import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EmployeeClock = ({ token, employeeId, employeeName, onLogout }) => {
  const [status, setStatus] = useState('clocked_out');
  const [currentEntry, setCurrentEntry] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [requirePhoto, setRequirePhoto] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`/api/time-entries/status/${employeeId}`);
      setStatus(response.data.status);
      setCurrentEntry(response.data.entry);
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch (err) {
      setError('Unable to access camera');
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvasRef.current.toDataURL('image/jpeg', 0.7);
      setPhotoData(imageData);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const clearPhoto = () => {
    setPhotoData(null);
  };

  const handleClock = async (action) => {
    if (requirePhoto && !photoData && (action === 'clock_in' || action === 'clock_out')) {
      setError('Photo required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      const response = await axios.post('/api/time-entries/clock', {
        employeeId,
        action,
        photoData
      });

      setSuccess(`${action.replace('_', ' ').toUpperCase()} successful`);
      setPhotoData(null);
      setCurrentEntry(response.data.entry);
      
      // Update status
      setTimeout(() => {
        fetchStatus();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Clock action failed');
    } finally {
      setLoading(false);
    }
  };

  const getTimeDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDurationDisplay = () => {
    if (!currentEntry || !currentEntry.clock_in) return '0:00';
    
    let endTime = new Date(currentEntry.clock_out || new Date());
    let startTime = new Date(currentEntry.clock_in);
    
    let duration = Math.round((endTime - startTime) / 60000); // minutes
    
    // Subtract lunch time
    if (currentEntry.lunch_minutes) {
      duration -= currentEntry.lunch_minutes;
    }

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="employee-clock-view">
      <div className="clock-header">
        <h1>Welcome, {employeeName}!</h1>
        <p>Employee Time Clock</p>
        <div className={`status-badge status-${status}`}>
          {status.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {currentEntry && currentEntry.clock_in && !currentEntry.clock_out && (
        <div className="status-info">
          <h3>Current Shift</h3>
          <p><strong>Clocked In:</strong> {getTimeDisplay(currentEntry.clock_in)}</p>
          <p><strong>Duration:</strong> {getDurationDisplay()}</p>
          {currentEntry.lunch_minutes > 0 && (
            <p><strong>Lunch Taken:</strong> {currentEntry.lunch_minutes} minutes</p>
          )}
        </div>
      )}

      {showCamera && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }} />
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button onClick={capturePhoto} className="camera-button">
              📷 Take Photo
            </button>
            <button onClick={stopCamera} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {photoData && !showCamera && (
        <div className="camera-preview">
          <img src={photoData} alt="captured" />
          <p>Photo captured ✓</p>
          <button onClick={clearPhoto} className="btn btn-secondary" style={{ marginTop: '10px' }}>
            Take Another Photo
          </button>
        </div>
      )}

      <div className="clock-buttons">
        <button
          onClick={() => {
            setPhotoData(null);
            if (requirePhoto && !photoData) {
              startCamera();
            } else {
              handleClock('clock_in');
            }
          }}
          disabled={status !== 'clocked_out' || loading}
          className="clock-button clock-in-btn"
        >
          <span style={{ fontSize: '1.5em' }}>✓</span>
          Clock In
        </button>

        <button
          onClick={() => {
            setPhotoData(null);
            if (requirePhoto && !photoData) {
              startCamera();
            } else {
              handleClock('clock_out');
            }
          }}
          disabled={status === 'clocked_out' || loading}
          className="clock-button clock-out-btn"
        >
          <span style={{ fontSize: '1.5em' }}>✕</span>
          Clock Out
        </button>

        <button
          onClick={() => handleClock('lunch_start')}
          disabled={status !== 'clocked_in' || loading}
          className="clock-button lunch-start-btn"
        >
          <span style={{ fontSize: '1.5em' }}>🍽️</span>
          Start Lunch
        </button>

        <button
          onClick={() => handleClock('lunch_end')}
          disabled={status !== 'on_lunch' || loading}
          className="clock-button lunch-end-btn"
        >
          <span style={{ fontSize: '1.5em' }}>✓</span>
          End Lunch
        </button>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button onClick={onLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>
    </div>
  );
};

export default EmployeeClock;
