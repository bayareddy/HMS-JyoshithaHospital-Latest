-- Run this SQL to create missing tables for Schedule Template and Time Off features

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create schedule_templates table
CREATE TABLE IF NOT EXISTS schedule_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    opd_slot_time INT DEFAULT 15,
    schedule JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create time_off_requests table
CREATE TABLE IF NOT EXISTS time_off_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    staff_name VARCHAR(255) NOT NULL,
    start_date_time DATETIME NOT NULL,
    end_date_time DATETIME NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
);

-- Add schedule_template_id column to staff table if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'staff' 
    AND COLUMN_NAME = 'schedule_template_id');

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE staff ADD COLUMN schedule_template_id INT DEFAULT NULL, ADD FOREIGN KEY (schedule_template_id) REFERENCES schedule_templates(id) ON DELETE SET NULL',
    'SELECT "Column schedule_template_id already exists"');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Insert default tasks
INSERT IGNORE INTO tasks (name, description, is_active) VALUES 
('OPD', 'Outpatient Department', TRUE),
('Surgery', 'Surgical procedures', TRUE),
('Emergency', 'Emergency services', TRUE),
('Laboratory', 'Lab tests and diagnostics', TRUE),
('Pharmacy', 'Pharmacy services', TRUE);

-- Insert sample roles (if not exist)
INSERT IGNORE INTO roles (name, description, is_active) VALUES
('Senior Consultant', 'Senior medical consultant', TRUE),
('Consultant', 'Medical consultant', TRUE),
('Senior Surgeon', 'Senior surgical specialist', TRUE),
('Head Nurse', 'Head nursing staff', TRUE),
('Staff Nurse', 'Nursing staff member', TRUE);

-- Insert sample departments (if not exist)
INSERT IGNORE INTO departments (name, description, is_active) VALUES
('Cardiology', 'Heart and cardiovascular care', TRUE),
('Neurology', 'Brain and nervous system care', TRUE),
('Orthopedics', 'Bone and joint care', TRUE),
('General Medicine', 'General medical care', TRUE),
('OB/GYN', 'Obstetrics and Gynecology', TRUE),
('ICU', 'Intensive Care Unit', TRUE);

-- Insert sample tenant (if not exist)
INSERT IGNORE INTO tenants (name, location, is_active) VALUES
('Jyoshita Clinic Main', 'Main Branch', TRUE);

-- Insert sample staff data (only if staff table is empty)
INSERT IGNORE INTO staff (name, role_id, department_id, phone, status, opd_window, tenant_id, is_active) VALUES
('Dr. Vikram Mehta', 1, 1, '+91 98400 11001', 'admitted', '15 min', 1, TRUE),
('Dr. Sunita Kapoor', 2, 2, '+91 98400 11002', 'admitted', '20 min', 1, TRUE),
('Dr. Ravi Singh', 3, 3, '+91 98400 11003', 'scheduled', '', 1, TRUE),
('Dr. Anita Iyer', 4, 4, '+91 98400 11004', 'admitted', '10 min', 1, TRUE),
('Dr. Preethi Verma', 5, 5, '+91 98400 11005', 'admitted', '15 min', 1, TRUE),
('Nurse Lakshmi R.', 6, 6, '+91 98400 11101', 'admitted', '', 1, TRUE),
('Nurse Kavya M.', 7, 7, '+91 98400 11102', 'admitted', '', 1, TRUE);

-- Verify tables
SELECT 'tasks' as table_name, COUNT(*) as row_count FROM tasks
UNION ALL
SELECT 'schedule_templates', COUNT(*) FROM schedule_templates
UNION ALL
SELECT 'time_off_requests', COUNT(*) FROM time_off_requests
UNION ALL
SELECT 'staff', COUNT(*) FROM staff;

SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'staff' 
AND COLUMN_NAME = 'schedule_template_id';