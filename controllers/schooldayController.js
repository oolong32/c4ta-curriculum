// Schoolday Controller
const Schoolday = require('../models/schoolday')
const Teacher = require('../models/teacher')
const { body,validationResult } = require('express-validator')

const async = require('async')

exports.index = (req, res, next) => {
  Schoolday.find({ date: { $gt: new Date('2023-03-01')}})
    .populate('teacherMorning')
    .populate('teacherAfternoon')
    .sort({date : 1})
    .exec((err, schooldays) => {
    if (err) { return next(err) }
    if (schooldays) {
      // Daten in die passende Struktur bringen:
      // In Semester und Monate teilen.
      const months = ['januar', 'februar', 'märz', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'dezember']
      const spring = { months: [] }
      const fall = { months: [] }
      for (let i = 0; i < schooldays.length; i += 2) { // in Zweierschritten durch die Schultage
        const friday = schooldays[i]
        const saturday = schooldays[i + 1]
        const weekend = { friday, saturday }
        const currentMonthIndex = friday.date.getMonth() // Monatszahl
        const currentMonth = months[currentMonthIndex] // Monatsname
        // In welchem Semester sind wir?
        let currentSemester = (currentMonthIndex < 7) ? spring : fall
        // gibt es schon einen Array für den aktuellen Monat?
        if ( !currentSemester.months.find(month => month.name === currentMonth)) {
          currentSemester.months.push({ name: currentMonth, weekends: [] }) // ein Objekt für Monat generieren
        }
        currentSemester.months.find(month => month.name === currentMonth).weekends.push(weekend)
      }
      // console.log(spring)
      // console.log(fall)
      res.render('index', {
        title: 'Stundenplan',
        schooldays: schooldays,
        semesters: { spring, fall },
        error: err
      })
    }
  })
}

// Herbstsemester 2022
exports.hs_2022 = (req, res, next) => {
  Schoolday.find({
    date: {
      $gt: new Date('2022-08-21'),
      $lt: new Date('2023-02-28')
    }
  })
    .populate('teacherMorning')
    .populate('teacherAfternoon')
    .sort({date : 1})
    .exec((err, schooldays) => {
    if (err) { return next(err) }
    if (schooldays) {
      res.render('index', {
        title: 'Herbstsemester 2022/23',
        error: err, schooldays: schooldays
      })
    }
  })
}

// Display list of all Schooldays.
exports.schoolday_list = (req, res, next) => {
  Schoolday.find({})
  .sort({date : 1})
  .populate('teacherMorning')
  .populate('teacherAfternoon')
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
  .populate('teacherMorning')
  .populate('teacherAfternoon')
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
    body('title-morning').trim().isLength({ min: 1 }).escape().withMessage('Titel für den Morgen angeben, bitte.'),
    body('teacher-morning').isLength({ min: 1 }).withMessage('Dozent:in für den Morgen angeben, bitte.'),
    body('title-afternoon').trim().isLength({ min: 1 }).escape().withMessage('Titel für den Nachmittag angeben, bitte.'),
    body('teacher-afternoon').isLength({ min: 1 }).withMessage('Dozent:in für den Nachmittag angeben, bitte.'),
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
        // Create an Schoolday object with escaped and trimmed data.
        const schoolday = new Schoolday( // was var, const ok?
          {
            date: req.body.date,
            room: req.body.room,
            titleMorning: req.body["title-morning"],
            teacherMorning: req.body["teacher-morning"],
            titleAfternoon: req.body["title-afternoon"],
            teacherAfternoon: req.body["teacher-afternoon"]
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
  .populate('teacherMorning')
  .populate('teacherAfternoon')
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
// Get book, authors and genres for form.
  async.parallel({
    schoolday: (callback) => {
        Schoolday.findById(req.params.id).populate('teacherMorning').populate('teacherAfternoon').exec(callback)
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
      console.log(results.schoolday.teacherMorning.id)
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
  body('title-morning').trim().isLength({ min: 1 }).escape().withMessage('Titel für den Morgen angeben, bitte.'),
  body('title-afternoon').trim().isLength({ min: 1 }).escape().withMessage('Titel für den Nachmittag angeben, bitte.'),
  body('room').optional({ checkFalsy: true }).trim().escape(),
  body('date', 'Ungültiges Datum').optional({ checkFalsy: true }).isISO8601().toDate(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req)

    // Create a schoolday object with escaped/trimmed data and old id.
    const schoolday = new Schoolday({ 
      room: req.body.room,
      date: req.body.date,
      titleMorning: req.body['title-morning'],
      teacherMorning: req.body['teacher-morning'],
      titleAfternoon: req.body['title-afternoon'],
      teacherAfternoon: req.body['teacher-afternoon'],
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
        console.log('still some errors')
        console.log(errors)
          res.render('forms/schoolday_form', {
          title: 'Schultag aktualisieren',
          teachers: results.teachers,
          schoolday: schoolday,
          errors: {}
        })
      })
      return
    } else {
      console.log("data all good!")
      // Data from form is valid. Update the record.
      // das passiert nicht!?
      Schoolday.findByIdAndUpdate(req.params.id, schoolday, {}, (err, theSchoolday) => {
        if (err) { return next(err) }
          // Successful - redirect to schoolday detail page.
          res.redirect(theSchoolday.url)
        })
    }
  }
]
