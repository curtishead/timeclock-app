import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeLogin = ({ onLogin, onBack }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/employees');
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }

    try {
      setError('');
      const response = await axios.post('/api/auth/employee-login', {
        employeeId: selectedEmployee
      });
      onLogin(response.data.token, response.data.employee);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="loading">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Employee Clock In</h2>
        <p>Select your name</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Select Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            required
          >
            <option value="">-- Choose your name --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Clock In
          </button>
          <button type="button" onClick={onBack} className="btn btn-secondary">
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeLogin;
