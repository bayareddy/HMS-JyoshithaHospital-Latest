const db = require('../config/db');

const getScheduleTemplates = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM schedule_templates ORDER BY id DESC');
    const templates = rows.map(row => ({
      ...row,
      opdSlotTime: row.opd_slot_time,
      isActive: row.is_active,
      schedule: row.schedule ? (typeof row.schedule === 'string' ? JSON.parse(row.schedule) : row.schedule) : []
    }));
    res.json(templates);
  } catch (error) {
    console.error('Error fetching schedule templates:', error);
    res.status(500).json({ error: error.message });
  }
};

const createScheduleTemplate = async (req, res) => {
  const { name, opdSlotTime, schedule, isActive } = req.body;
  const active = isActive === false ? 0 : 1;
  try {
    const [result] = await db.query(
      'INSERT INTO schedule_templates (name, opd_slot_time, schedule, is_active) VALUES (?, ?, ?, ?)',
      [name, opdSlotTime, JSON.stringify(schedule), active]
    );
    res.status(201).json({ id: result.insertId, name, opdSlotTime, schedule, isActive: active });
  } catch (error) {
    console.error('Error creating schedule template:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateScheduleTemplate = async (req, res) => {
  const { id } = req.params;
  const { name, opdSlotTime, schedule, isActive } = req.body;
  const active = isActive === false ? 0 : 1;
  try {
    await db.query(
      'UPDATE schedule_templates SET name = ?, opd_slot_time = ?, schedule = ?, is_active = ? WHERE id = ?',
      [name, opdSlotTime, JSON.stringify(schedule), active, id]
    );
    res.json({ id: parseInt(id), name, opdSlotTime, schedule, isActive: active });
  } catch (error) {
    console.error('Error updating schedule template:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteScheduleTemplate = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM schedule_templates WHERE id = ?', [id]);
    res.json({ message: 'Schedule template deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getScheduleTemplates, createScheduleTemplate, updateScheduleTemplate, deleteScheduleTemplate };