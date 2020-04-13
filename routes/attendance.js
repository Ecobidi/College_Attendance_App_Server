const router = require('express').Router();
const Attendance = require('../models/attendance');

router.get('/find_by_students', (req, res) => {
  let usernames = Array.isArray(req.query.username) ? req.query.username : [req.query.username];
  const startDate = req.query.startDate ? (new Date(req.query.startDate)).getTime() : new Date('2000-01-01').getTime();
  const endDate = req.query.endDate ? (new Date(req.query.endDate)).getTime() : new Date().getTime();
  let patterns = usernames.map((username) => new RegExp(`(^${username}$){1}`, 'i'))
  
  Attendance
    .find({$or: [{ absent: {$in: patterns}}, {excused: {$in: patterns}}, {present: {$in: patterns}}]})
    .populate('_course', 'title, code')
    .populate('_present', 'name username')
    .populate('_absent', 'name username')
    .populate('_excused', 'name username')
    .where('dateTaken').gte(startDate)
    .where('dateTaken').lte(endDate)
    .exec((err, docs) => {
      if (err) return res.status(400).json({err_msg: err.message});
      console.log(docs)
      res.json({data: docs});
    })
  // let select_query = `SELECT course_id FROM student_course_join_tbl WHERE (student_id = ?)`;
  // req.db.all(select_query, [student_id], (err, results) => {
  //   if (err) return res.status(400).json({err_msg: err.message});
  //   let query = `SELECT course_id, present, absent, excused FROM attendance_tbl WHERE course_id in (
  //     ${ results.map(item => item.course_id) }
  //   )`;
  //   // console.log(query)
  //   req.db.all(query, [], (err, results) => {
  //     if (err) return res.status(400).json({err_msg: err.message});
  //     console.log(results);
  //     for (let i = 0; i < results.length; i++) {
  //       let a = { course_id: results[i].course_id};
        
  //     }
  //     res.json(results)
  //   })
  // })
});



router.get('/find_by_courses', (req, res) => {
  console.log(req.url)
  let course_codes = Array.isArray(req.query.course_code) ? req.query.course_code : [req.query.course_code];
  const startDate = req.query.startDate ? (new Date(req.query.startDate)).getTime() : (new Date('2000-01-01').getTime());
  const endDate = req.query.endDate ? (new Date(req.query.endDate)).getTime() : (new Date().getTime());
  let patterns = course_codes.map((code) => new RegExp(`(^${code}$){1}`, 'i'))

  console.log(patterns)
  Attendance
    .find({course: {$in: patterns}})
    .populate('_course', 'title, code')
    .populate('_present', 'name username')
    .populate('_absent', 'name username')
    .populate('_excused', 'name username')
    .where('dateTaken').gte(startDate)
    .where('dateTaken').lte(endDate)
    .exec((err, docs) => {
      if (err) return res.status(400).json({err_msg: err.message});
        console.log(docs)
        res.json({data: docs})
      })
})

router.get('/find_by_date', (req, res) => {
  const startDate = new Date(req.query.startDate).getTime();
  const endDate = new Date(req.query.endDate).getTime();
  console.log('find by date called')
  Attendance.find()
  .populate('_course', 'code title')
  .populate('_present', 'name username')
  .populate('_absent', 'name username')
  .populate('_excused', 'name username')
  .where('dateTaken').gte(startDate)
  .where('dateTaken').lte(endDate)
    .exec((err, docs) => {
      if (err) return res.status(400).json({err_msg: err.message});
      res.json({data: docs});
    })
    // let select_query = `SELECT * FROM attendance_tbl where (date BETWEEN ? AND ?)`;
    // req.db.all(select_query, [startDate, endDate], (err, results) => {
      //   if (err) return res.status(400).json({err_msg: err.message});
      //   res.json({data: results});
      // })
});
    
router.post('/new', (req, res) => {
  const formBody = {course, teacher, present, absent, excused, dateTaken} = req.body;
  dateTaken = new Date(dateTaken);
  
  let newDoc = new Attendance({...formBody, dateTaken});
  newDoc.save((err, savedDoc) => {
    if (err) return res.status(400).json({err_msg: err.message});
    res.json({data: savedDoc});
  })
  
  // console.log(req.body);
  // date = new Date(date).getTime();
  // present = present.split(',').map(item => `[${item.trim()}]`).join(' ');
      
  // absent = absent.split(',').map(item => `[${item.trim()}]`).join(' ');
  // excused = excused.split(',').map(item => `[${item.trim()}]`).join(' ');
  // let insert_query = `INSERT INTO attendance_tbl (course_id, teacher_id, present, absent, excused, date) values (?, ?, ?, ?, ?, ?);`;
  // req.db.run(insert_query, [course, teacher, present, absent, excused, date], (err, result) => {
    //   if (err) return res.status(400).json({err_msg: err.message});
  //   res.json({data: result});
  // })
});

// const mergeSameStudents = (array) => {
//   let data = new Map();
//   array.forEach(({username, name, count}) => {
//     if (data.has(username)) {
//       let current = data.get(username)
//       data.set(username, {username, name, count: ++current.count})
//     } else {
//       data.set(username, {username, name, count: 1})
//     }
//   })
//   return [...data.values()];
// }

// const mergeSameCourses = (array) => {
//   let data = new Map()//[...array];
//   array.forEach(({course, _absent, _present, _excused}) => {
//     if (data.has(course)) { // update existing info
//       let current = data.get(course);
//       data.set(course, {
//         course,
//         totalAttendance: current.totalAttendance + 1,
//         _absent: [...current._absent, ..._absent],
//         _present: [...current._present, ..._present],
//         _excused: [...current._excused, ..._excused]
//       })
//     } else {
//       data.set(course, {course, _absent, _present, _excused, totalAttendance: 1})
//     }
//   })
//   return [...data.values()];
// }

// const getCount = (arr, value) => {
//   let data = arr.find(a => a.username == value)
//   return data ? data.count : 0;
// }

// const arrangeByStudents = (byCourses, students) => {
//   let mStudents = new Map();
//   students.forEach(student => {
//     byCourses.forEach(({course, _absent, _present, _excused, totalAttendance}) => {
//       let data = {
//         course,
//         totalAttendance,
//         _absent: getCount(_absent, student),
//         _present: getCount(_present, student),
//         _excused: getCount(_excused, student)
//       }
//       if (mStudents.has(student)) {
//         let current = mStudents.get(student)
//         mStudents.set(student, {...current, data: [...current.data, data]})
//       } else {
//         mStudents.set(student, {student, data: [data]})
//       }
//     })
//   })
//   return [...mStudents.values()];
// }

// const getStudents = (array) => {
//   let students = new Set();
//   array.forEach(({_present, _absent, _excused}) => {
//     _present.forEach(item => students.add(item.username));
//     _absent.forEach(item => students.add(item.username));
//     _excused.forEach(item => students.add(item.username))
//   })
//   return [...students.values()]
// }

// const arrangeByCourses = (byCourses, students) => {
//   let map = new Map();
//   byCourses.forEach(({course, totalAttendance, _absent, _excused, _present}) => {
//     let container = []
//     students.forEach(student => {
//       let data = {
//         username: student,
//         _absent: getCount(_absent, student),
//         _excused: getCount(_excused, student),
//         _present: getCount(_present, student)
//       }
//       container.push(data)
//     })
//     map.set(course, {course, totalAttendance, data: container});
//   })
//   return [...map.values()];
// }

module.exports = router;