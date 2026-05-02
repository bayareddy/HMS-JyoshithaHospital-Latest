const db = require('../config/db');

const getTasks = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  const { name, description, isActive } = req.body;
  const active = isActive === false ? 0 : 1;
  try {
    const [result] = await db.query(
      'INSERT INTO tasks (name, description, is_active) VALUES (?, ?, ?)',
      [name, description, active]
    );
    res.status(201).json({ id: result.insertId, name, description, isActive: active });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { name, description, isActive } = req.body;
  const active = isActive === false ? 0 : 1;
  try {
    await db.query(
      'UPDATE tasks SET name = ?, description = ?, is_active = ? WHERE id = ?',
      [name, description, active, id]
    );
    res.json({ id: parseInt(id), name, description, isActive: active });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };