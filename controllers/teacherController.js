// Teacher Controller
const Teacher = require('../models/teacher')
const Schoolday = require('../models/schoolday')
const { body, validationResult } = require('express-validator')

const async = require('async')

// Display list of all teachers.
exports.teacher_list = (req, res, next) => {
  Teacher.find({})
  .sort({name : 1})
  .exec((err, teachers) => {
    if (err) { return next(err) }
    if (teachers) {
      res.render('teachers', {
        title: 'Liste der Dozierenden',
        teachers: teachers
      })
    }
  })
}

// Display detail page for a specific teacher.
exports.teacher_detail = (req, res, next) => {
  async.parallel({
    teacher: (callback) => {
      Teacher.findById(req.params.id).exec(callback)
    },
    schooldays: (callback) => {
      Schoolday.find({ 'teacher': req.params.id }).exec(callback)
    }
  }, (err, results) => {
    if (err) { return next(err)}
    if (results.teacher == null) { // no result
      const err = new Error('Dozierende:n nicht gefunden.')
      err.status = 404
      return next(err)
    }
    // successful, render
    res.render('teacher', { title: results.teacher.name, teacher: results.teacher, schooldays: results.schooldays })
  })
}

// Display teacher create form on GET.
exports.teacher_create_get = (req, res, next) => {
  res.render('forms/teacher_form', {
    title: 'Dozierende erfassen',
    teacher: req.body,
    errors: [] 
  })
}

// Handle teacher create on POST.
exports.teacher_create_post = [
  // Validate and sanitize the name field.
  // no escape() bc. ugly in bot/ics. might be neccessary at later date?
  body('name', 'Name des/der Dozierenden wird benötigt').trim().isLength({ min: 1 }),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req)

    // Create a teacher object with trimmed data.
    const teacher = new Teacher({ name: req.body.name })

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('teacher_form', { title: 'Dozierende erfassen', teacher: teacher, errors: errors.array() })
      return
    } else {
      // Data from form is valid.
      // Check if a teacher with same name already exists.
      Teacher.findOne({ 'name': req.body.name })
        .exec((err, found_teacher) => {
          if (err) { return next(err) }

          if (found_teacher) {
            // Teacher exists, redirect to its detail page.
            res.redirect(found_teacher.url)
          } else {
            teacher.save((err) => {
              if (err) { return next(err) }
              // Teacher saved. Redirect to Teacher detail page.
              res.redirect(teacher.url)
            })
          }
      })
    }
  }
]

// Display teacher delete form on GET.
exports.teacher_delete_get = (req, res, next) => {
  async.parallel({
    teacher: (callback) => {
        Teacher.findById(req.params.id).exec(callback)
    },
    schooldays: (callback) => {
        Schoolday.find({ 'teacher': req.params.id }).exec(callback)
    },
}, (err, results, next) => {
    if (err) { return next(err) }
    if (results.teacher==null) { // No results.
        res.redirect('/dozierende')
    }
    // Successful, so render.
    res.render('teacher_delete', {
      title: `${results.teacher.name} löschen`,
      teacher: results.teacher,
      schooldays: results.schooldays
    } )
  })
}

// Handle teacher delete on POST.
exports.teacher_delete_post = (req, res, next) => {
  async.parallel({
    teacher: (callback) => {
      Teacher.findById(req.body.teacherid).exec(callback)
    },
    schooldays: (callback) => {
      Schoolday.find({ 'teacher': req.body.teacherid }).exec(callback)
    },
}, (err, results) => {
    if (err) { return next(err) }
    // Success
    if (results.schooldays.length > 0) {
      // Teacher has schooldays. Render in same way as for GET route.
      res.render('teacher_delete', { title: `${results.teacher.name} löschen`, teacher: results.teacher, schooldays: results.schooldays } )
      return
    }
    else {
      // Teacher has no books. Delete object and redirect to the list of teachers.
      Teacher.findByIdAndRemove(req.body.teacherid, function deleteTeacher(err) {
        if (err) { return next(err) }
        // Success - go to teacher list
        res.redirect('/dozierende')
      })
    }
  })
}

// Display teacher update form on GET.
exports.teacher_update_get = (req, res, next) => {
  Teacher.findById( req.params.id ).exec((err, teacher) => {
  if (err) { return next(err) }
  if (teacher) {
    res.render('forms/teacher_form', {
      title: `${teacher.name} aktualisieren`, 
      teacher: teacher,
      errors: {}
      })
    }
  })
}

// Handle teacher update on POST.
exports.teacher_update_post = [
  // body('name', 'Name des/der Dozierenden wird benötigt').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    const errors = validationResult(req)
    // Create a teacher object with trimmed data and old id.
    const teacher = new Teacher(
      { name: req.body.name,
        _id:req.params.id // this is required, or a new ID will be assigned
      })
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      // Get teacher
      Teacher.findById(req.params.id).exec((err, teacher) => {
        if (err) { return next(err) }
        if (teacher) {
          res.render('forms/teacher_form', {
            title: `${teacher.name} aktualisieren`, 
            teacher: teacher,
            errors: errors
            })
          }
        })
      } else {
      // Data from form is valid. Update the record.
      Teacher.findByIdAndUpdate(req.params.id, teacher, {}, (err, theTeacher) => {
        if (err) { return next(err) }
          // Successful - redirect to teacher detail page.
          res.redirect(theTeacher.url)
        })
      }
   }
]