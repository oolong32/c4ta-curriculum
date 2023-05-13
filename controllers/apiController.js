// API Controller
const Schoolday = require('../models/schoolday')
const Teacher = require('../models/teacher')

const async = require('async')

// the curriculum
exports.index = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  Schoolday.find()
    .populate('teacher')
    .sort({date : 1})
    .exec((err, schooldays) => {
    if (err) { return next(err) }
    if (schooldays) {
      const cleanSchooldays = schooldays.map(schoolday => {
        return {
          id: schoolday.id,
          title: schoolday.title,
          description: schoolday.description,
          room: schoolday.room,
          date: schoolday.date.toISOString().split('T')[0], // cut off timestamp
          web_url: schoolday.url,
          api_url: `/api/schoolday/${schoolday.id}`,
          teacher: {
            name: schoolday.teacher.name,
            id: schoolday.teacher.id,
            web_url: schoolday.teacher.url,
            api_url: `/api/teacher/${schoolday.teacher.id}`
          }
        }
      })
      res.send(JSON.stringify(cleanSchooldays))
    }
  })
}

// schoolday
exports.schoolday = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  Schoolday.findById(req.params.id)
  .populate('teacher')
  .exec((err, schoolday) => {
    if (err) { return next(err) }
    if (schoolday) {
      const cleanTeacher = {
        name: schoolday.teacher.name,
        id: schoolday.teacher.id,
        web_url: schoolday.teacher.url,
        api_url: `/api/teacher/${schoolday.teacher.id}`
      }
      const cleanSchoolday = {
        id: schoolday.id,
        title: schoolday.title,
        date: schoolday.date.toISOString().split('T')[0], // cut off timestamp
        web_url: schoolday.url,
        description: schoolday.description,
        teacher: cleanTeacher
      }
      res.send(JSON.stringify(cleanSchoolday))
    }
  })
}

// teachers
exports.teachers = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  Teacher.find({})
  .sort({name : 1})
  .exec((err, teachers) => {
    if (err) { return next(err) }
    if (teachers) {
      const cleanTeachers = teachers.map(teacher => {
        return {
          name: teacher.name,
          id: teacher.id,
          web_url: teacher.url,
          api_url: `/api/teacher/${teacher.id}`
        }
      })
      res.send(JSON.stringify(cleanTeachers))
    }
  })
}

// single teacher
exports.teacher = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
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
    const cleanSchooldays = results.schooldays.map(schoolday => {
      return {
        id: schoolday.id,
        title: schoolday.title,
        description: schoolday.description,
        room: schoolday.room,
        date: schoolday.date.toISOString().split('T')[0],
        web_url: schoolday.url,
        api_url: `/api/schoolday/${schoolday.id}`
      }
    })
    const cleanTeacher = {
      name: results.teacher.name,
      id: results.teacher.id,
      web_url: results.teacher.url,
      schooldays: cleanSchooldays
    }

    res.send(JSON.stringify(cleanTeacher))
  })
}