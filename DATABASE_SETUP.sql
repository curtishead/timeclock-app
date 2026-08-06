-- Time Clock Database Schema
-- Run this in Supabase SQL Editor

-- Create employees table
CREATE TABLE employees (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  hourly_wage DECIMAL(10, 2) DEFAULT 0,
  overtime_eligible BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create time_entries table
CREATE TABLE time_entries (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT NOT NULL REFERENCES employees(id),
  clock_in TIMESTAMP NOT NULL,
  clock_out TIMESTAMP,
  lunch_start TIMESTAMP,
  lunch_end TIMESTAMP,
  lunch_minutes INTEGER DEFAULT 0,
  clock_in_photo TEXT,
  clock_out_photo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create admins table
CREATE TABLE admins (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_time_entries_employee_id ON time_entries(employee_id);
CREATE INDEX idx_time_entries_clock_in ON time_entries(clock_in);
CREATE INDEX idx_admins_email ON admins(email);

-- Enable storage for photos (Supabase)
-- Note: Create a bucket called "time-clock-photos" in Supabase Storage

-- Insert sample employee (optional - delete if you want to start fresh)
INSERT INTO employees (name, hourly_wage, overtime_eligible) VALUES
('John Doe', 25.00, true),
('Jane Smith', 22.50, false);
