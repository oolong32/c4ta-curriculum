const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schoolday = new Schema({
  title: { type: String, required: true, unique: true },
  description: [ String ],
  room: { type: String, uppercase: true, default: 'X.000'},
  date: Date,
  updated: { type: Date, default: Date.now() },
  teacher: { type: Schema.Types.ObjectId, ref:'Teacher', required: true } 
})

// Virtual for book's URL
BookSchema
.virtual('url')
.get(function () {
  return '/catalog/book/' + this._id;
});

module.exports = mongoose.model('Schoolday', schooldaySchema)