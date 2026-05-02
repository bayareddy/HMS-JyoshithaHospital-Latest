const express = require('express');
const { getScheduleTemplates, createScheduleTemplate, updateScheduleTemplate, deleteScheduleTemplate } = require('../controllers/scheduleTemplatesController');
const router = express.Router();

router.get('/', getScheduleTemplates);
router.post('/', createScheduleTemplate);
router.put('/:id', updateScheduleTemplate);
router.delete('/:id', deleteScheduleTemplate);

module.exports = router;