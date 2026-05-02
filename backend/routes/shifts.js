const express = require('express');
const { getShifts, createShift } = require('../controllers/shiftsController');
const router = express.Router();

router.get('/', getShifts);
router.post('/', createShift);

module.exports = router;