const express = require('express')
const router = express.Router()

// Require controller modules.
const api_controller = require('../controllers/apiController')

// Handle CORS
const cors = require('cors')

/* Stundenplan Routes */

// GET /stundenplan
router.get('/', cors(), api_controller.index)

// GET request for one schoolday.
router.get('/schoolday/:id', cors(), api_controller.schoolday)

// GET request for list of all teachers
router.get('/teachers', cors(), api_controller.teachers)

// GET request for a single teacher and their days
router.get('/teacher/:id', cors(), api_controller.teacher)

module.exports = router