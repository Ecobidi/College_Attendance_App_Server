let mongoose = require('mongoose');

let TeacherSchema = mongoose.Schema({
  //teacher_id: {type: Number, required: true, unique: true},
  name: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: String,
  phone: String,
  courses: [String]
});

TeacherSchema.virtual('_courses', {
  ref: 'course',
  localField: 'courses',
  foreignField: 'code',
  justOne: false
});

module.exports = mongoose.model('teacher', TeacherSchema);