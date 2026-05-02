const db = require('../config/db');

// Get all appointments with joins
const getAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.*,
        p.frist_name as patient_name,
        s.name as doctor_name,
        s.department_id as doctor_department_id,
        d.name as department_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN staff s ON a.doctor_id = s.id
      LEFT JOIN departments d ON s.department_id = d.id
      ORDER BY a.id DESC
    `);
    const formatted = rows.map(row => {
      const appointmentDate = new Date(row.appointment_time);
      const localDate = new Date(appointmentDate.getTime() - appointmentDate.getTimezoneOffset() * 60000);
      return {
        id: row.id,
        time: row.appointment_time ? appointmentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
        date: row.appointment_time ? localDate.toISOString().split('T')[0] : '',
        patient: row.p_name || row.patient_name || 'Unknown',
        doctor: row.doctor_name || 'Unknown',
        type: row.type || '',
        reason: row.type || '',
        department: row.department_name || '',
        status: row.status || 'scheduled'
      };
    });
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  const { appointment_time, doctor_id, type, status, p_name, patient_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO appointments (appointment_time, patient_id, doctor_id, type, status, p_name) VALUES (?, ?, ?, ?, ?, ?)',
      [appointment_time, patient_id, doctor_id, type, status || 'scheduled', p_name || null]
    );
    // Fetch the created appointment
    const [rows] = await db.query(`
      SELECT 
        a.*,
        p.frist_name as patient_name,
        s.name as doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN staff s ON a.doctor_id = s.id
      WHERE a.id = ?
    `, [result.insertId]);
    
    const row = rows[0];
    const appointmentDate = new Date(row.appointment_time);
    const localDate = new Date(appointmentDate.getTime() - appointmentDate.getTimezoneOffset() * 60000);
    res.status(201).json({
      id: row.id,
      time: row.appointment_time ? appointmentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
      date: row.appointment_time ? localDate.toISOString().split('T')[0] : '',
      patient: row.p_name || row.patient_name || 'Unknown',
      doctor: row.doctor_name || 'Unknown',
      type: row.type || '',
      department: '',
      status: row.status || 'scheduled'
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update an appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { appointment_time, doctor_id, type, p_name } = req.body;
  try {
    await db.query(
      'UPDATE appointments SET appointment_time = ?, doctor_id = ?, type = ?, p_name = ? WHERE id = ?',
      [appointment_time, doctor_id, type, p_name, id]
    );
    // Fetch the updated appointment
    const [rows] = await db.query(`
      SELECT 
        a.*,
        p.frist_name as patient_name,
        s.name as doctor_name,
        s.department_id as doctor_department_id,
        d.name as department_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN staff s ON a.doctor_id = s.id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE a.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const row = rows[0];
    const appointmentDate = new Date(row.appointment_time);
    const localDate = new Date(appointmentDate.getTime() - appointmentDate.getTimezoneOffset() * 60000);
    res.json({
      id: row.id,
      time: row.appointment_time ? appointmentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
      date: row.appointment_time ? localDate.toISOString().split('T')[0] : '',
      patient: row.p_name || row.patient_name || 'Unknown',
      doctor: row.doctor_name || 'Unknown',
      type: row.type || '',
      department: row.department_name || '',
      status: row.status || 'scheduled'
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAppointments, createAppointment, updateAppointment };