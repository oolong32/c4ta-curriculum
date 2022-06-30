const express = require('express')
const router = express.Router()

// Require controller modules.
const schoolday_controller = require('../controllers/schooldayController')

/* Stundenplan Routes */

// GET /stundenplan
router.get('/', schoolday_controller.index)

// GET request for creating a Schoolday. This must
// come before routes that displays a schoolday (uses id).
router.get('/schultag/erfassen', schoolday_controller.schoolday_create_get)

// POST request for creating schoolday.
router.post('/schultag/erfassen', schoolday_controller.schoolday_create_post)

// GET request to delete schoolday.
router.get('/schultag/:id/loeschen', schoolday_controller.schoolday_delete_get)

// POST request to delete schoolday.
router.post('/schultag/:id/loeschen', schoolday_controller.schoolday_delete_post)

// GET request to update schoolday.
router.get('/schultag/:id/aktualisieren', schoolday_controller.schoolday_update_get)

// POST request to update schoolday.
router.post('/schultag/:id/aktualisieren', schoolday_controller.schoolday_update_post)

// GET request for one schoolday.
router.get('/schultag/:id', schoolday_controller.schoolday_detail)

// GET request for list of all schoolday items.
router.get('/schultage', schoolday_controller.schoolday_list)

module.exports = router