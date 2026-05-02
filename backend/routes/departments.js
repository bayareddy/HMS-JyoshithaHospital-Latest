const express = require('express');
const { getDepartments, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentsController');
const router = express.Router();

router.get('/', getDepartments);
router.post('/', createDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;