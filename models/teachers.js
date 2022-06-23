const mongoose = require('mongoose')
const Schema = mongoose.Schema

const teacher = new Schema({
  name: { type: String, required: true, unique: true },
})

// Virtual for teacher's URL
TeacherSchema
.virtual('url')
.get(function () {
  return '/teacher/' + this._id;
})

module.exports = mongoose.model('Teacher', TeacherSchema)