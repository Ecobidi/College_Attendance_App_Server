const mongoose = require('mongoose');

let CourseSchema = mongoose.Schema({
  //course_id: {type: Number, required: true, unique: true},
  title: {type: String, required: true},
  code: {type: String, unique: true, required: true},
});

module.exports = mongoose.model('course', CourseSchema);