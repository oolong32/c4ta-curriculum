const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TeacherSchema = new Schema({
  name: { type: String, required: true, unique: true },
})

// Virtual for teacher's URL
TeacherSchema
.virtual('url')
.get(function () {
  return '/dozierende/' + this._id;
})

module.exports = mongoose.model('Teacher', TeacherSchema)