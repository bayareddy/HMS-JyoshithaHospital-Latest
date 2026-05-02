const express = require('express');
const { getAppointments, createAppointment, updateAppointment } = require('../controllers/appointmentsController');
const router = express.Router();

router.get('/', getAppointments);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);

module.exports = router;