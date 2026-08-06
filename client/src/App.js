import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import EmployeeLogin from './components/EmployeeLogin';
import EmployeeClock from './components/EmployeeClock';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [view, setView] = useState('login-choice'); // login-choice, employee-login, employee-clock, admin-login, admin-dashboard
  const [employeeToken, setEmployeeToken] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [adminEmail, setAdminEmail] = useState(null);

  useEffect(() => {
    // Check for stored tokens
    const storedEmployeeToken = localStorage.getItem('employeeToken');
    const storedEmployeeId = localStorage.getItem('employeeId');
    const storedEmployeeName = localStorage.getItem('employeeName');
    const storedAdminToken = localStorage.getItem('adminToken');
    const storedAdminEmail = localStorage.getItem('adminEmail');

    if (storedAdminToken) {
      setAdminToken(storedAdminToken);
      setAdminEmail(storedAdminEmail);
      setView('admin-dashboard');
    } else if (storedEmployeeToken) {
      setEmployeeToken(storedEmployeeToken);
      setEmployeeId(storedEmployeeId);
      setEmployeeName(storedEmployeeName);
      setView('employee-clock');
    }
  }, []);

  const handleEmployeeLogin = (token, employee) => {
    localStorage.setItem('employeeToken', token);
    localStorage.setItem('employeeId', employee.id);
    localStorage.setItem('employeeName', employee.name);
    setEmployeeToken(token);
    setEmployeeId(employee.id);
    setEmployeeName(employee.name);
    setView('employee-clock');
  };

  const handleAdminLogin = (token, email) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminEmail', email);
    setAdminToken(token);
    setAdminEmail(email);
    setView('admin-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setEmployeeToken(null);
    setEmployeeId(null);
    setEmployeeName(null);
    setAdminToken(null);
    setAdminEmail(null);
    setView('login-choice');
  };

  return (
    <div className="app-container">
      {view === 'login-choice' && (
        <div className="login-choice">
          <h1>Time Clock</h1>
          <div className="button-group">
            <button onClick={() => setView('employee-login')} className="btn btn-large">
              Employee Clock In
            </button>
            <button onClick={() => setView('admin-login')} className="btn btn-large">
              Administrator
            </button>
          </div>
        </div>
      )}

      {view === 'employee-login' && (
        <EmployeeLogin 
          onLogin={handleEmployeeLogin}
          onBack={() => setView('login-choice')}
        />
      )}

      {view === 'employee-clock' && (
        <EmployeeClock 
          token={employeeToken}
          employeeId={employeeId}
          employeeName={employeeName}
          onLogout={handleLogout}
        />
      )}

      {view === 'admin-login' && (
        <AdminLogin 
          onLogin={handleAdminLogin}
          onBack={() => setView('login-choice')}
        />
      )}

      {view === 'admin-dashboard' && (
        <AdminDashboard 
          token={adminToken}
          email={adminEmail}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
