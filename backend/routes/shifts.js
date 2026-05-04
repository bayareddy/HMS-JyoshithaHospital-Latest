const express = require('express');
const { getShifts, createShift, updateShift, deleteShift } = require('../controllers/shiftsController');
const router = express.Router();

router.get('/', getShifts);
router.post('/', createShift);
router.put('/:id', updateShift);
router.delete('/:id', deleteShift);

module.exports = router;
