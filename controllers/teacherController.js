// Teacher Controller
const Author = require('../models/teacher')
const Schoolday = require('../models/schoolday')

// Display list of all teachers.
exports.teacher_list = function(req, res) {
  res.send('NOT IMPLEMENTED: teacher list')
}

// Display detail page for a specific teacher.
exports.teacher_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: teacher detail: ' + req.params.id)
}

// Display teacher create form on GET.
exports.teacher_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: teacher create GET')
}

// Handle teacher create on POST.
exports.teacher_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: teacher create POST')
}

// Display teacher delete form on GET.
exports.teacher_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: teacher delete GET')
}

// Handle teacher delete on POST.
exports.teacher_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: teacher delete POST')
}

// Display teacher update form on GET.
exports.teacher_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: teacher update GET')
}

// Handle teacher update on POST.
exports.teacher_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: teacher update POST')
}