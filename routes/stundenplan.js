const express = require('express')
const router = express.Router()

// Require controller modules.
const schoolday_controller = require('../controllers/schooldayController')
const teacher_controller = require('../controllers/teacherController')

/* Stundenplan Routes */


// GET /stundenplan
router.get('/', schoolday_controller.index)

// GET request for creating a Schoolday. This must
// come before routes that displays a schoolday (uses id).
router.get('/schultag/create', schoolday_controller.schoolday_create_get)

// POST request for creating schoolday.
router.post('/schultag/create', schoolday_controller.schoolday_create_post)

// GET request to delete schoolday.
router.get('/schultag/:id/delete', schoolday_controller.schoolday_delete_get)

// POST request to delete schoolday.
router.post('/schultag/:id/delete', schoolday_controller.schoolday_delete_post)

// GET request to update schoolday.
router.get('/schultag/:id/update', schoolday_controller.schoolday_update_get)

// POST request to update schoolday.
router.post('/schultag/:id/update', schoolday_controller.schoolday_update_post)

// GET request for one schoolday.
router.get('/schultag/:id', schoolday_controller.schoolday_detail)

// GET request for list of all schoolday items.
router.get('/schultage', schoolday_controller.schoolday_list)

/* Teacher Routes */

// GET request for creating teacher. This must
// come before route for id (i.e. display author).
router.get('/dozierende/create', teacher_controller.teacher_create_get)

// POST request for creating teacher.
router.post('/dozierende/create', teacher_controller.teacher_create_post)

// GET request to delete teacher.
router.get('/dozierende/:id/delete', teacher_controller.teacher_delete_get)

// POST request to delete teacher.
router.post('/dozierende/:id/delete', teacher_controller.teacher_delete_post)

// GET request to update teacher.
router.get('/dozierende/:id/update', teacher_controller.teacher_update_get)

// POST request to update teacher.
router.post('/dozierende/:id/update', teacher_controller.teacher_update_post)

// GET request for one teacher.
router.get('/dozierende/:id', teacher_controller.teacher_detail)

// GET request for list of all teachers.
router.get('/dozierende', teacher_controller.teacher_list)

module.exports = router