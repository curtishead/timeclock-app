import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ token, email, onLogout }) => {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [payrollWeek, setPayrollWeek] = useState(getCurrentWeek());
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const api = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  function getCurrentWeek() {
    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(year, 0, 1);
    const diff = now - start;
    const oneDay = 86400000;
    const day = Math.floor(diff / oneDay);
    const week = Math.ceil((day + start.getDay() + 1) / 7);
    return `${year}-W${String(week).padStart(2, '0')}`;
  }

  useEffect(() => {
    if (activeTab === 'employees') {
      fetchEmployees();
    } else if (activeTab === 'payroll') {
      fetchPayroll();
    }
  }, [activeTab, payrollWeek]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/employees');
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/payroll/${payrollWeek}`);
      setPayroll(response.data);
    } catch (err) {
      setError('Failed to load payroll');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployeeName) {
      setError('Employee name required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await api.post('/api/admin/employees', {
        name: newEmployeeName,
        hourly_wage: 0,
        overtime_eligible: false
      });
      setNewEmployeeName('');
      setSuccess('Employee added successfully');
      fetchEmployees();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add employee');
    }
  };

  const handleUpdateEmployee = async (id, updates) => {
    try {
      setError('');
      await api.put(`/api/admin/employees/${id}`, updates);
      setSuccess('Employee updated');
      fetchEmployees();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update employee');
    }
  };

  const exportPayrollCSV = () => {
    if (payroll.length === 0) {
      setError('No payroll data to export');
      return;
    }

    let csv = 'Employee,Hourly Wage,Total Hours,Regular Hours,Overtime Hours,Regular Pay,Overtime Pay,Total Pay\n';
    
    payroll.forEach(row => {
      csv += `"${row.employee_name}",${row.hourly_wage},${row.total_hours},${row.regular_hours},${row.overtime_hours},${row.regular_pay.toFixed(2)},${row.overtime_pay.toFixed(2)},${row.total_pay.toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-${payrollWeek}.csv`;
    a.click();
  };

  const viewPhotos = (entries) => {
    const photoEntries = entries.filter(e => e.clock_in_photo || e.clock_out_photo);
    if (photoEntries.length === 0) {
      alert('No photos for this employee this week');
      return;
    }

    let photoHtml = '<div style="max-width: 800px; overflow-y: auto; max-height: 600px;">';
    photoEntries.forEach(entry => {
      photoHtml += '<div style="margin-bottom: 20px; border: 1px solid #ddd; padding: 10px;">';
      photoHtml += `<p><strong>${new Date(entry.clock_in).toLocaleDateString()}</strong></p>`;
      if (entry.clock_in_photo) {
        photoHtml += `<p>Clock In:</p><img src="${entry.clock_in_photo}" style="max-width: 300px; margin-bottom: 10px;">`;
      }
      if (entry.clock_out_photo) {
        photoHtml += `<p>Clock Out:</p><img src="${entry.clock_out_photo}" style="max-width: 300px;">`;
      }
      photoHtml += '</div>';
    });
    photoHtml += '</div>';

    const newWindow = window.open();
    newWindow.document.write(photoHtml);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Administrator Dashboard</h1>
          <p style={{ color: '#999', fontSize: '0.9em', marginTop: '5px' }}>Logged in as: {email}</p>
        </div>
        <button onClick={onLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          👥 Employees
        </button>
        <button
          className={`tab-button ${activeTab === 'payroll' ? 'active' : ''}`}
          onClick={() => setActiveTab('payroll')}
        >
          💰 Payroll
        </button>
      </div>

      {/* Employees Tab */}
      <div className={`tab-content ${activeTab === 'employees' ? 'active' : ''}`}>
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Add New Employee</h3>
          <form onSubmit={handleAddEmployee} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              placeholder="Employee name"
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px'
              }}
            />
            <button type="submit" className="btn btn-primary">
              Add Employee
            </button>
          </form>
        </div>

        <h3 style={{ marginBottom: '15px' }}>Current Employees</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : employees.length === 0 ? (
          <p style={{ color: '#999' }}>No employees yet. Add one above.</p>
        ) : (
          <div className="employee-list">
            {employees.map((emp) => (
              <div key={emp.id} className="employee-card">
                <div className="employee-info">
                  <h3>{emp.name}</h3>
                  <p>ID: {emp.id}</p>
                </div>

                <div className="employee-wage-input">
                  <label>Hourly Wage</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={emp.hourly_wage || 0}
                    onChange={(e) => {
                      const updatedEmps = employees.map(e =>
                        e.id === emp.id ? { ...e, hourly_wage: parseFloat(e.target.value) || 0 } : e
                      );
                      setEmployees(updatedEmps);
                      handleUpdateEmployee(emp.id, { hourly_wage: parseFloat(e.target.value) });
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div className="overtime-checkbox">
                  <input
                    type="checkbox"
                    id={`overtime-${emp.id}`}
                    checked={emp.overtime_eligible || false}
                    onChange={(e) => {
                      handleUpdateEmployee(emp.id, { overtime_eligible: e.target.checked });
                    }}
                  />
                  <label htmlFor={`overtime-${emp.id}`}>
                    Overtime Pay (1.5x)
                  </label>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#999', fontSize: '0.85em', marginBottom: '5px' }}>
                    ${(emp.hourly_wage || 0).toFixed(2)}/hr
                  </p>
                  <p style={{ color: '#999', fontSize: '0.85em' }}>
                    {emp.overtime_eligible ? '1.5x overtime' : 'Flat rate'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payroll Tab */}
      <div className={`tab-content ${activeTab === 'payroll' ? 'active' : ''}`}>
        <div className="payroll-week-selector">
          <label>Week:</label>
          <input
            type="week"
            value={payrollWeek}
            onChange={(e) => setPayrollWeek(e.target.value)}
          />
          <button onClick={fetchPayroll} className="btn btn-primary">
            Load
          </button>
          <button onClick={exportPayrollCSV} className="btn btn-secondary">
            📥 Export CSV
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading payroll...</div>
        ) : payroll.length === 0 ? (
          <p style={{ color: '#999' }}>No payroll data for this week.</p>
        ) : (
          <div className="payroll-summary">
            {payroll.map((row) => (
              <div key={row.employee_id} className="payroll-card">
                <div style={{ gridColumn: '1 / -1', marginBottom: '10px' }}>
                  <h3 style={{ marginBottom: '5px' }}>{row.employee_name}</h3>
                  <p style={{ color: '#999', fontSize: '0.9em' }}>
                    ${row.hourly_wage.toFixed(2)}/hr {row.overtime_eligible ? '(1.5x overtime)' : '(flat rate)'}
                  </p>
                  {row.entries && row.entries.length > 0 && (
                    <button
                      onClick={() => viewPhotos(row.entries)}
                      style={{
                        marginTop: '5px',
                        background: 'none',
                        border: 'none',
                        color: '#667eea',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '0.85em'
                      }}
                    >
                      📷 View Photos
                    </button>
                  )}
                </div>

                <div className="payroll-item">
                  <label>Total Hours</label>
                  <value>{row.total_hours.toFixed(2)}</value>
                </div>

                <div className="payroll-item">
                  <label>Regular Hours</label>
                  <value>{row.regular_hours.toFixed(2)}</value>
                </div>

                {row.overtime_hours > 0 && (
                  <div className="payroll-item">
                    <label>Overtime Hours</label>
                    <value>{row.overtime_hours.toFixed(2)}</value>
                  </div>
                )}

                <div className="payroll-item">
                  <label>Regular Pay</label>
                  <value>${row.regular_pay.toFixed(2)}</value>
                </div>

                {row.overtime_pay > 0 && (
                  <div className="payroll-item">
                    <label>Overtime Pay</label>
                    <value>${row.overtime_pay.toFixed(2)}</value>
                  </div>
                )}

                <div className="payroll-item total-pay">
                  <label>TOTAL PAY</label>
                  <value>${row.total_pay.toFixed(2)}</value>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
