const express = require('express')
const router = express.Router()

// Require controller modules.
const api_controller = require('../controllers/apiController')

/* Stundenplan Routes */

// GET /stundenplan
router.get('/', api_controller.index)

// GET request for one schoolday.
router.get('/schoolday/:id', api_controller.schoolday)

// GET request for list of all teachers
router.get('/teachers', api_controller.teachers)

// GET request for a single teacher and their days
router.get('/teacher/:id', api_controller.teacher)

module.exports = router