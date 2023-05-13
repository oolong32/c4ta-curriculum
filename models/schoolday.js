const mongoose = require('mongoose');
const { schoolday_create_get } = require('../controllers/schooldayController');
const Schema = mongoose.Schema

const SchooldaySchema = new Schema({
  date: Date,
  room: { type: String, uppercase: true, default: 'X.000'},
  titleMorning: { type: String, required: true, unique: false },
  teacherMorning: { type: Schema.Types.ObjectId, ref:'Teacher', required: true },
  titleAfternoon: { type: String, required: true, unique: false },
  teacherAfternoon: { type: Schema.Types.ObjectId, ref:'Teacher', required: true },
  updated: { type: Date, default: Date.now() },
}, {  toJSON: { virtuals: true }})

// Virtual for schoolday's URL
SchooldaySchema
.virtual('url')
.get(function () {
  return '/stundenplan/schultag/' + this._id;
});

// Virtual for teacher’s name
SchooldaySchema
.virtual('teacherName')
.get(() => {
  return
})
module.exports = mongoose.model('Schoolday', SchooldaySchema)
