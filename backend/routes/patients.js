const express = require('express');
const { getPatients, createPatient, updatePatient } = require('../controllers/patientsController');
const router = express.Router();

router.get('/', getPatients);
router.post('/', createPatient);
router.put('/:id', updatePatient);

module.exports = router;