const mongoose = require('mongoose');
const { schoolday_create_get } = require('../controllers/schooldayController');
const Schema = mongoose.Schema

const SchooldaySchema = new Schema({
  title: { type: String, required: true, unique: false },
  description: [ String ],
  room: { type: String, uppercase: true, default: 'X.000'},
  date: Date,
  updated: { type: Date, default: Date.now() },
  teacher: { type: Schema.Types.ObjectId, ref:'Teacher', required: true } 
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
