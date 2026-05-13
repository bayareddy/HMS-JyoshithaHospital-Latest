const express = require('express');
const { getStaff, getActiveDoctors, createStaff, updateStaff, deleteStaff } = require('../controllers/staffController');
const router = express.Router();

router.get('/', getStaff);
router.get('/doctors/active', getActiveDoctors);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

module.exports = router;