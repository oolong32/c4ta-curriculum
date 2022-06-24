// Schoolday Controller
const Schoolday = require('../models/schoolday')
const Teacher = require('../models/teacher')

var async = require('async');

exports.index = (req, res) => {
  async.parallel({
    schoolday_count: (callback) => {
      Schoolday.countDocuments({}, callback)
    },
    // passed_schoolday_count: (callback) => {
      // Schoolday.countDocuments({ date: passed }, callback)
    // },
    teacher_count: (callback) => {
      Teacher.countDocuments({}, callback)
    }
  }, function (err, results) {
    res.render('index', { title: 'C4tA Stundenplan', error: err, data: results })
  })
}

// Display all schooldays.
exports.schoolday_list = function (req, res) {
  res.send('NOT IMPLEMENTED: shit, schoolday list')
}

// Display detail page for a specific schoolday.
exports.schoolday_detail = function (req, res) {
  res.send('NOT IMPLEMENTED: schoolday detail: ' + req.params.id)
}

// Display schoolday create form on GET.
exports.schoolday_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: schoolday create GET')
}

// Handle schoolday create on POST.
exports.schoolday_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: schoolday create POST')
}

// Display schoolday delete form on GET.
exports.schoolday_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: schoolday delete GET')
}

// Handle schoolday delete on POST.
exports.schoolday_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: schoolday delete POST')
}

// Display schoolday update form on GET.
exports.schoolday_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: schoolday update GET')
}

// Handle schoolday update on POST.
exports.schoolday_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: schoolday update POST')
}