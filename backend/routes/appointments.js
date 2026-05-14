const express = require('express');
const { getAppointments, createAppointment, updateAppointment, getSlots } = require('../controllers/appointmentsController');
const router = express.Router();

router.get('/', getAppointments);
router.get('/slots', getSlots);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);

module.exports = router;