// Schoolday Controller
const Schoolday = require('../models/schoolday')
const Teacher = require('../models/teacher')
const { body,validationResult } = require('express-validator')

const async = require('async')

exports.index = (req, res, next) => {
  Schoolday.find()
    .populate('teacher')
    .sort({date : 1})
    .exec((err, schooldays) => {
    if (err) { return next(err) }
    if (schooldays) {
      res.render('index', {
        title: 'Stundenplan 2023',
        error: err, schooldays: schooldays
      })
    }
  })
}

// Display list of all Schooldays.
exports.schoolday_list = (req, res, next) => {
  Schoolday.find({})
  .sort({date : 1})
  .populate('teacher')
  .exec((err, schooldays) => {
    if (err) { return next(err) }
    if (schooldays) {
      res.render('schooldays', {
        title: 'Lister der Schultage',
        schooldays: schooldays
      })
    }
  })
}

// Display detail page for a specific schoolday.
exports.schoolday_detail = (req, res, next) => {
  Schoolday.findById(req.params.id)
  .populate('teacher')
  .exec((err, schoolday) => {
    if (err) { return next(err) }
    if (schoolday) {
      res.render('schoolday', { title: schoolday.title, schoolday: schoolday })
    }
  })
}

// Display schoolday create form on GET.
exports.schoolday_create_get = (req, res, next) => {
  // Get teachers to populate the select options.
  let teachers = []
  Teacher.find()
  .exec((err, found_teachers) => {
    if (err) { return next(err) }
    if (found_teachers) {
      teachers = [...found_teachers.map(teacher => { return {name: teacher.name, id: teacher.id}})]
      res.render('forms/schoolday_form', {
        title: 'Schultag erfassen',
        schoolday: req.body,
        teachers: teachers, errors: []
      })
    }
  })
}

// Handle schoolday create on POST.
exports.schoolday_create_post = [ // Handle schoolday create on POST.
    // Validate and sanitize fields.
    body('title').trim().isLength({ min: 1 }).escape().withMessage('Titel angeben, bitte.'),
    body('description.*').optional({ checkFalsy: true }).trim().escape(),
    body('room').optional({ checkFalsy: true }).trim().escape(),
    body('date', 'Ungültiges Datum').optional({ checkFalsy: true }).isISO8601().toDate(),
    // Process request after validation and sanitization.
    (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('forms/schoolday_form', {
          title: 'Schultag erfassen',
          schoolday: req.body, errors: errors.array()
        })
        return
      }
      else {
        // Data from form is valid.
        // prune empty fields from description array
        let descrDirty = req.body.description.slice() // copy array
        const indexesOfEmptyItems = []
        let i = 0
        descrDirty.forEach(el => { // get indexes of empty items
          if (el === "") {indexesOfEmptyItems.push(i)}
          i += 1
        })
        indexesOfEmptyItems.reverse() // reverse to delete from back to fore
        for (const i of indexesOfEmptyItems) { // delete empty items
          descrDirty.splice(i, 1)
        }
        const descrClean = descrDirty.slice() // clean copy (all this copying is rather redundant)
        // Create an Schoolday object with escaped and trimmed data.
        const schoolday = new Schoolday( // was var, const ok?
          {
            title: req.body.title,
            room: req.body.room,
            description: descrClean,
            date: req.body.date,
            teacher: req.body.teacher
          })
        schoolday.save((err) => {
          if (err) { return next(err) }
          // Successful - redirect to new schoolday record.
          res.redirect(schoolday.url)
        })
      }
    }
]

// Display schoolday delete form on GET.
exports.schoolday_delete_get = (req, res) => {
  Schoolday.findById(req.params.id)
  .populate('teacher')
  .exec((err, schoolday) => {
    if (err) { return next(err) }
    if (schoolday) {
      res.render('schoolday_delete', {
        title: schoolday.title,
        schoolday: schoolday
      })
    }
  })
}

// Handle schoolday delete on POST.
exports.schoolday_delete_post = (req, res) => {
  Schoolday.findByIdAndRemove(req.body.schooldayid, function deleteSchoolday(err) {
    if (err) { return next(err) }
    // Success - go to teacher list
    res.redirect('/stundenplan/schultage')
})
}

// Display schoolday update form on GET.
exports.schoolday_update_get = (req, res, next) => {
  // aufräumen, los!
// Get book, authors and genres for form.
  async.parallel({
    schoolday: (callback) => {
        Schoolday.findById(req.params.id).populate('teacher').exec(callback)
    },
    teachers: (callback) => {
      Teacher.find(callback)
    },
  }, (err, results) => {
      if (err) { return next(err) }
      if (results.schoolday == null) { // No results.
          const err = new Error('Schultag nicht gefunden')
          err.status = 404
          return next(err)
      }
      // Success.
      res.render('forms/schoolday_form', {
        title: 'Schultag aktualisieren',
        teachers: results.teachers,
        schoolday: results.schoolday,
        errors: {}
       })
  })
}

// Handle schoolday update on POST.
exports.schoolday_update_post = [
  // Validate and sanitize fields.
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Titel angeben, bitte.'),
  body('description.*').optional({ checkFalsy: true }).trim().escape(),
  body('room').optional({ checkFalsy: true }).trim().escape(),
  body('date', 'Ungültiges Datum').optional({ checkFalsy: true }).isISO8601().toDate(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req)

    // prune empty fields from description array
    let descrDirty = req.body.description.slice() // copy array
    const indexesOfEmptyItems = []
    let i = 0
    descrDirty.forEach(el => { // get indexes of empty items
      if (el === "") {indexesOfEmptyItems.push(i)}
      i += 1
    })
    indexesOfEmptyItems.reverse() // reverse to delete from back to fore
    for (const i of indexesOfEmptyItems) { // delete empty items
      descrDirty.splice(i, 1)
    }
    const descrClean = descrDirty.slice() // clean copy (all this copying is rather redundant)

    // Create a schoolday object with escaped/trimmed data and old id.
    const schoolday = new Schoolday(
      { title: req.body.title,
        room: req.body.room,
        description: descrClean,
        date: req.body.date,
        teacher: req.body.teacher,
        _id:req.params.id // this is required, or a new ID will be assigned
        })

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form. <— depp, nur ein datensatz, braucht doch kein async.parallel!
      async.parallel({
        teachers: (callback) => {
          Teacher.find(callback)
        }
      }, (err, results) => {
        if (err) { return next(err) }

        res.render('forms/schoolday_form', {
          title: 'Schultag aktualisieren',
          teachers: results.teachers,
          schoolday: results.schoolday,
          errors: {}
        })
      })
      return
    } else {
      // Data from form is valid. Update the record.
      Schoolday.findByIdAndUpdate(req.params.id, schoolday, {}, (err, theSchoolday) => {
        if (err) { return next(err) }
          // Successful - redirect to schoolday detail page.
          res.redirect(theSchoolday.url)
        })
    }
  }
]