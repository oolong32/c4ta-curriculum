const express = require('express')
const router = express.Router()

// Require controller modules.
const teacher_controller = require('../controllers/teacherController')

/* Teacher Routes */

// GET request for creating teacher. This must
// come before route for id (i.e. display author).
router.get('/erfassen', teacher_controller.teacher_create_get)

// POST request for creating teacher.
router.post('/erfassen', teacher_controller.teacher_create_post)

// GET request to delete teacher.
router.get('/:id/loeschen', teacher_controller.teacher_delete_get)

// POST request to delete teacher.
router.post('/:id/loeschen', teacher_controller.teacher_delete_post)

// GET request to update teacher.
router.get('/:id/aktualisieren', teacher_controller.teacher_update_get)

// POST request to update teacher.
router.post('/:id/aktualisieren', teacher_controller.teacher_update_post)

// GET request for one teacher.
router.get('/:id', teacher_controller.teacher_detail)

// GET request for list of all teachers.
// router.get('/dozierende', teacher_controller.teacher_list)
router.get('/', teacher_controller.teacher_list)

module.exports = router