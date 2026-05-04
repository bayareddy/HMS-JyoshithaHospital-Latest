const db = require('../config/db');

const mapRowToStaff = (row) => ({
  id: row.id,
  name: row.name,
  roleId: row.role_id,
  role: row.role_name || 'N/A',
  departmentId: row.department_id,
  department: row.department_name || 'N/A',
  phone: row.phone,
  status: row.status,
  opdWindow: row.opd_window,
  tenantId: row.tenant_id,
  tenant: row.tenant_name || 'N/A',
  shiftId: row.shift_id,
  shift: row.shift_name || '',
  isActive: row.is_active === 1
});

// Get all staff with joined data
const getStaff = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id, s.name, s.role_id, s.department_id, s.phone, s.status, 
        s.opd_window, s.tenant_id, s.shift_id, s.is_active,
        r.name as role_name,
        d.name as department_name,
        t.name as tenant_name,
        st.name as shift_name
      FROM staff s
      LEFT JOIN roles r ON s.role_id = r.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN tenants t ON s.tenant_id = t.id
      LEFT JOIN shifts st ON s.shift_id = st.id
    `);
    res.json(rows.map(mapRowToStaff));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new staff member
const createStaff = async (req, res) => {
  const { name, roleId, departmentId, phone, status, opdWindow, tenantId, shiftId, isActive } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO staff (name, role_id, department_id, phone, status, opd_window, tenant_id, shift_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, roleId || 1, departmentId || 1, phone || '', status || 'admitted', opdWindow || '15 min', tenantId || 1, shiftId || null, isActive !== false]
    );
    
    const [rows] = await db.query(`
      SELECT s.*, r.name as role_name, d.name as department_name, t.name as tenant_name, st.name as shift_name
      FROM staff s
      LEFT JOIN roles r ON s.role_id = r.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN tenants t ON s.tenant_id = t.id
      LEFT JOIN shifts st ON s.shift_id = st.id
      WHERE s.id = ?
    `, [result.insertId]);
    
    res.status(201).json(mapRowToStaff(rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a staff member
const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, roleId, departmentId, phone, status, opdWindow, tenantId, shiftId, isActive } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE staff SET name = ?, role_id = ?, department_id = ?, phone = ?, status = ?, opd_window = ?, tenant_id = ?, shift_id = ?, is_active = ? WHERE id = ?',
      [name, roleId || 1, departmentId || 1, phone || '', status, opdWindow || '15 min', tenantId || 1, shiftId || null, isActive !== false, parseInt(id)]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    
    const [rows] = await db.query(`
      SELECT s.*, r.name as role_name, d.name as department_name, t.name as tenant_name, st.name as shift_name
      FROM staff s
      LEFT JOIN roles r ON s.role_id = r.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN tenants t ON s.tenant_id = t.id
      LEFT JOIN shifts st ON s.shift_id = st.id
      WHERE s.id = ?
    `, [parseInt(id)]);
    
    res.json(mapRowToStaff(rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a staff member
const deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM staff WHERE id = ?', [parseInt(id)]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getStaff, createStaff, updateStaff, deleteStaff };