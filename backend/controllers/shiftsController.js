const db = require('../config/db');

const getShifts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM shifts ORDER BY id DESC');
    const shifts = rows.map(row => ({
      ...row,
      opdSlotTime: row.opd_slot_time,
      isActive: row.is_active,
      schedule: row.schedule ? (typeof row.schedule === 'string' ? JSON.parse(row.schedule) : row.schedule) : []
    }));
    res.json(shifts);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    res.status(500).json({ error: error.message });
  }
};

const createShift = async (req, res) => {
  const { name, opdSlotTime, schedule, isActive } = req.body;
  const active = isActive === false ? 0 : 1;
  try {
    const [result] = await db.query(
      'INSERT INTO shifts (name, opd_slot_time, schedule, is_active) VALUES (?, ?, ?, ?)',
      [name, opdSlotTime, JSON.stringify(schedule), active]
    );
    res.status(201).json({ id: result.insertId, name, opdSlotTime, schedule, isActive: active });
  } catch (error) {
    console.error('Error creating shift:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateShift = async (req, res) => {
  const { id } = req.params;
  const { name, opdSlotTime, schedule, isActive } = req.body;
  const active = isActive === false ? 0 : 1;
  try {
    await db.query(
      'UPDATE shifts SET name = ?, opd_slot_time = ?, schedule = ?, is_active = ? WHERE id = ?',
      [name, opdSlotTime, JSON.stringify(schedule), active, id]
    );
    res.json({ id: parseInt(id), name, opdSlotTime, schedule, isActive: active });
  } catch (error) {
    console.error('Error updating shift:', error.stack || error);
    res.status(500).json({ error: error.message });
  }
};

const deleteShift = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM shifts WHERE id = ?', [id]);
    res.json({ message: 'Shift deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getShifts, createShift, updateShift, deleteShift };
