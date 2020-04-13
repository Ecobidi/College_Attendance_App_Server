let mongoose = require('mongoose');
//let Course = require('./course')

let StudentSchema = mongoose.Schema({
  //student_id: {type: Number, required: true, unique: true},
  name: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: String,
  phone: String,
  courses: [String]
});

StudentSchema.virtual('_courses', {
  ref: 'course',
  localField: 'courses',
  foreignField: 'code',
  justOne: false
})

module.exports = mongoose.model('student', StudentSchema);