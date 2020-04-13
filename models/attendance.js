let mongoose = require('mongoose');
//let Student = require('./student');

let AttendanceSchema = mongoose.Schema({
  //attendance_id: {type: Number, required: true, unique: true},
  // course: {
  //   required: true,
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'course'
  // },
  course: String,
  dateTaken: {
    type: Number, // timeStamp
    required: true
  },
  // teacher: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'teacher'
  // },
  teacher: String,
  present: [{ type: String }],
  absent: [{ type: String }],
  excused: [{ type: String }]
}, {toJSON: {virtuals: true}});

AttendanceSchema.virtual('_course', {
  ref: 'course',
  localField: 'course',
  foreignField: 'code',
  justOne: true
})

AttendanceSchema.virtual('_teacher', {
  ref: 'teacher',
  localField: 'teacher',
  foreignField: 'username',
  justOne: true
})

AttendanceSchema.virtual('_present', {
  ref: 'student',
  localField: 'present',
  foreignField: 'username',
  justOne: false
})

AttendanceSchema.virtual('_absent', {
  ref: 'student',
  localField: 'absent',
  foreignField: 'username',
  justOne: false
})

AttendanceSchema.virtual('_excused', {
  ref: 'student',
  localField: 'excused',
  foreignField: 'username',
  justOne: false
})

module.exports = mongoose.model('attendance', AttendanceSchema);