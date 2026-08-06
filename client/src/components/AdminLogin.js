import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [setupKey, setSetupKey] = useState('');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const response = await axios.post('/api/auth/admin-login', {
        email,
        password
      });
      onLogin(response.data.token, response.data.admin.email);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await axios.post('/api/auth/create-admin', {
        email: setupEmail,
        password: setupPassword,
        setupKey
      });
      setError('');
      alert('Admin account created! Please log in.');
      setShowSetup(false);
      setSetupEmail('');
      setSetupPassword('');
      setSetupKey('');
    } catch (err) {
      setError(err.response?.data?.error || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  if (showSetup) {
    return (
      <div className="form-container">
        <div className="form-header">
          <h2>Create Admin Account</h2>
          <p>First time setup</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSetup}>
          <div className="form-group">
            <label>Setup Key</label>
            <input
              type="password"
              value={setupKey}
              onChange={(e) => setSetupKey(e.target.value)}
              placeholder="Setup key"
              required
            />
            <p style={{ fontSize: '0.8em', color: '#999', marginTop: '5px' }}>
              Check your environment variables for ADMIN_SETUP_KEY
            </p>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={setupEmail}
              onChange={(e) => setSetupEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={setupPassword}
              onChange={(e) => setSetupPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={() => setShowSetup(false)}
              className="btn btn-secondary"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Administrator Login</h2>
        <p>Payroll & Settings</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button type="button" onClick={onBack} className="btn btn-secondary">
            Back
          </button>
        </div>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setShowSetup(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.9em'
          }}
        >
          Don't have an account? Create one
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
