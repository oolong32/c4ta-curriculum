const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TeacherSchema = new Schema({
  lastName: { type: String, required: true, unique: false },
  firstName: { type: String, required: true, unique: false }
}, {  toJSON: { virtuals: true }})

// Virtual for teacher's URL
TeacherSchema
.virtual('url')
.get(function () {
  return '/dozierende/' + this._id
})

// Virtual for teacher's name
TeacherSchema
.virtual('name')
.get(function () {
  return `${this.firstName} ${this.lastName}`
})

// Virtual for teacher's initials
TeacherSchema
.virtual('initials')
.get(function () {
  return `${this.firstName[0]}${this.lastName[0]}`
})

module.exports = mongoose.model('Teacher', TeacherSchema)