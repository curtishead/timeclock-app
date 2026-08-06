require('dotenv').config();
console.log('SUPABASE_URL from env:', process.env.SUPABASE_URL);
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Admin key for server-side operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ==================== AUTHENTICATION ====================

// Employee login (by employee name/ID)
app.post('/api/auth/employee-login', async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID required' });
    }

    // Get employee
    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (error || !employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const token = jwt.sign(
      { id: employee.id, name: employee.name, role: 'employee' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ token, employee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin login
app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create admin account (first time setup)
app.post('/api/auth/create-admin', async (req, res) => {
  try {
    const { email, password, setupKey } = req.body;
    
    // Simple setup key validation (should be set in env)
    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(401).json({ error: 'Invalid setup key' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('admins')
      .insert([{ email, password_hash: passwordHash }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, message: 'Admin account created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ==================== TIME TRACKING ====================

// Clock in/out
app.post('/api/time-entries/clock', async (req, res) => {
  try {
    const { employeeId, action, photoData } = req.body;
    const now = new Date().toISOString();

    if (!employeeId || !action) {
      return res.status(400).json({ error: 'Employee ID and action required' });
    }

    // Get the latest open entry
    const { data: lastEntry } = await supabase
      .from('time_entries')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let entry;

    if (action === 'clock_in') {
      // Create new clock in entry
      let photoUrl = null;
      
      if (photoData) {
        try {
          const base64Data = photoData.split(',')[1];
          const fileName = `photos/${employeeId}/${Date.now()}.jpg`;
          
          const { error: uploadError } = await supabase.storage
            .from('time-clock-photos')
            .upload(fileName, Buffer.from(base64Data, 'base64'), {
              contentType: 'image/jpeg'
            });

          if (!uploadError) {
            const { data } = supabase.storage
              .from('time-clock-photos')
              .getPublicUrl(fileName);
            photoUrl = data.publicUrl;
          }
        } catch (photoErr) {
          console.log('Photo upload error:', photoErr);
        }
      }

      const { data: newEntry, error } = await supabase
        .from('time_entries')
        .insert([{
          employee_id: employeeId,
          clock_in: now,
          clock_in_photo: photoUrl
        }])
        .select()
        .single();

      if (error) throw error;
      entry = newEntry;

    } else if (action === 'clock_out') {
      if (!lastEntry || lastEntry.clock_out) {
        return res.status(400).json({ error: 'No active clock in' });
      }

      let photoUrl = lastEntry.clock_out_photo;
      
      if (photoData) {
        try {
          const base64Data = photoData.split(',')[1];
          const fileName = `photos/${employeeId}/${Date.now()}.jpg`;
          
          const { error: uploadError } = await supabase.storage
            .from('time-clock-photos')
            .upload(fileName, Buffer.from(base64Data, 'base64'), {
              contentType: 'image/jpeg'
            });

          if (!uploadError) {
            const { data } = supabase.storage
              .from('time-clock-photos')
              .getPublicUrl(fileName);
            photoUrl = data.publicUrl;
          }
        } catch (photoErr) {
          console.log('Photo upload error:', photoErr);
        }
      }

      const { data: updatedEntry, error } = await supabase
        .from('time_entries')
        .update({ clock_out: now, clock_out_photo: photoUrl })
        .eq('id', lastEntry.id)
        .select()
        .single();

      if (error) throw error;
      entry = updatedEntry;

    } else if (action === 'lunch_start') {
      if (!lastEntry || lastEntry.clock_out) {
        return res.status(400).json({ error: 'Must be clocked in' });
      }

      const { data: updatedEntry, error } = await supabase
        .from('time_entries')
        .update({ lunch_start: now })
        .eq('id', lastEntry.id)
        .select()
        .single();

      if (error) throw error;
      entry = updatedEntry;

    } else if (action === 'lunch_end') {
      if (!lastEntry || lastEntry.clock_out || !lastEntry.lunch_start) {
        return res.status(400).json({ error: 'Invalid lunch state' });
      }

      // Calculate lunch minutes
      const lunchStart = new Date(lastEntry.lunch_start);
      const lunchEnd = new Date(now);
      const lunchMinutes = Math.round((lunchEnd - lunchStart) / 60000);

      const newLunchTotal = (lastEntry.lunch_minutes || 0) + lunchMinutes;

      const { data: updatedEntry, error } = await supabase
        .from('time_entries')
        .update({ lunch_end: now, lunch_minutes: newLunchTotal })
        .eq('id', lastEntry.id)
        .select()
        .single();

      if (error) throw error;
      entry = updatedEntry;
    }

    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current status
app.get('/api/time-entries/status/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;

    const { data: lastEntry } = await supabase
      .from('time_entries')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!lastEntry) {
      return res.json({ status: 'clocked_out', entry: null });
    }

    let status = 'clocked_out';
    if (lastEntry.clock_in && !lastEntry.clock_out) {
      if (lastEntry.lunch_start && !lastEntry.lunch_end) {
        status = 'on_lunch';
      } else {
        status = 'clocked_in';
      }
    }

    res.json({ status, entry: lastEntry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ADMIN ENDPOINTS ====================

// Get all employees
app.get('/api/admin/employees', async (req, res) => {
  try {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('*')
      .order('name');
    if (error) {
      console.log('Supabase error:', error);
      throw error;
    }
    console.log('Employees loaded:', employees);
    res.json(employees);
  } catch (err) {
    console.log('Catch error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add employee
app.post('/api/admin/employees', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, hourly_wage, overtime_eligible } = req.body;

    const { data: employee, error } = await supabase
      .from('employees')
      .insert([{ name, hourly_wage, overtime_eligible }])
      .select()
      .single();

    if (error) throw error;
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update employee
app.put('/api/admin/employees/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { hourly_wage, overtime_eligible } = req.body;

    const { data: employee, error } = await supabase
      .from('employees')
      .update({ hourly_wage, overtime_eligible })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get weekly payroll
app.get('/api/admin/payroll/:week', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { week } = req.params; // Format: YYYY-W##
    const [year, weekNum] = week.split('-W');
    
    // Calculate Monday of that week
    const jan4 = new Date(year, 0, 4);
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - jan4.getDay() + 1);
    monday.setDate(monday.getDate() + (weekNum - 1) * 7);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const { data: entries, error } = await supabase
      .from('time_entries')
      .select('*')
      .gte('clock_in', monday.toISOString())
      .lte('clock_in', sunday.toISOString());

    if (error) throw error;

    // Get all employees
    const { data: employees } = await supabase
      .from('employees')
      .select('*');

    // Calculate payroll
    const payroll = employees.map(emp => {
      const empEntries = entries.filter(e => e.employee_id === emp.id);
      
      let totalMinutes = 0;
      empEntries.forEach(entry => {
        if (entry.clock_in && entry.clock_out) {
          const clockIn = new Date(entry.clock_in);
          const clockOut = new Date(entry.clock_out);
          let dayMinutes = Math.round((clockOut - clockIn) / 60000);
          const lunchMinutes = entry.lunch_minutes || 0;
          dayMinutes -= lunchMinutes;
          totalMinutes += Math.max(0, dayMinutes);
        }
      });

      const totalHours = totalMinutes / 60;
      let regularHours = totalHours;
      let overtimeHours = 0;

      if (emp.overtime_eligible && totalHours > 40) {
        regularHours = 40;
        overtimeHours = totalHours - 40;
      }

      const regularPay = regularHours * emp.hourly_wage;
      const overtimePay = overtimeHours * emp.hourly_wage * 1.5;
      const totalPay = regularPay + overtimePay;

      return {
        employee_id: emp.id,
        employee_name: emp.name,
        hourly_wage: emp.hourly_wage,
        overtime_eligible: emp.overtime_eligible,
        total_hours: parseFloat(totalHours.toFixed(2)),
        regular_hours: parseFloat(regularHours.toFixed(2)),
        overtime_hours: parseFloat(overtimeHours.toFixed(2)),
        regular_pay: parseFloat(regularPay.toFixed(2)),
        overtime_pay: parseFloat(overtimePay.toFixed(2)),
        total_pay: parseFloat(totalPay.toFixed(2)),
        entries: empEntries
      };
    });

    res.json(payroll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static files from client build
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
