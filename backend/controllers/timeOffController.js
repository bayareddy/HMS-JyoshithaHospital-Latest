const db = require('../config/db');

const getTimeOffRequests = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM time_off_requests ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching time off requests:', error);
    res.status(500).json({ error: error.message });
  }
};

const getTimeOffRequestsByStaff = async (req, res) => {
  const { staffId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM time_off_requests WHERE staff_id = ? ORDER BY created_at DESC', [staffId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching time off requests by staff:', error);
    res.status(500).json({ error: error.message });
  }
};

const createTimeOffRequest = async (req, res) => {
  const { staff_id, staff_name, start_date_time, end_date_time, reason, status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO time_off_requests (staff_id, staff_name, start_date_time, end_date_time, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [staff_id, staff_name, start_date_time, end_date_time, reason, status || 'pending']
    );
    
    const [rows] = await db.query('SELECT * FROM time_off_requests WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating time off request:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateTimeOffRequest = async (req, res) => {
  const { id } = req.params;
  const { start_date_time, end_date_time, reason, status } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE time_off_requests SET start_date_time = ?, end_date_time = ?, reason = ?, status = ? WHERE id = ?',
      [start_date_time, end_date_time, reason, status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Time off request not found' });
    }
    const [rows] = await db.query('SELECT * FROM time_off_requests WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating time off request:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTimeOffRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM time_off_requests WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Time off request not found' });
    }
    res.json({ message: 'Time off request deleted successfully', id: parseInt(id) });
  } catch (error) {
    console.error('Error deleting time off request:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTimeOffRequests, getTimeOffRequestsByStaff, createTimeOffRequest, updateTimeOffRequest, deleteTimeOffRequest };