CREATE TABLE schedule_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    opd_slot_time INT DEFAULT 15,
    schedule JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE time_off_requests (
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