const router = require('express').Router();
const md5 = require('md5');
const Student = require('../models/student');

router.get('/', (req, res) => {
  //let prev_id = req.query.prev_id || 0;
  let count = req.query.count || 20;
  // let select_query = `SELECT * FROM student_tbl`;
  // req.db.all(select_query, [], (err, rows) => {
  //   if (err) return res.status(400).json({err_msg: err.message});
  //   res.json({data: rows});
  // })

  Student.find()
    .select('-password')
    .sort({_id: 1})
    .limit(count)
    .exec((err, students) => {
      if (err) return res.status(400).json({err_msg: err.message});
      res.json({data: students});
    })
})

router.get('/:username/courses', (req, res) => {
// let query = `SELECT * FROM course_tbl WHERE course_id IN (
//   SELECT course_id FROM student_course_join_tbl WHERE student_id = ?)`;
// req.db.all(query, [req.params.student_id], (err, results) => {
//   if (err) return res.status(400).json({err_msg: err.message});
//   res.json(results);
// })

  Student.findOne({username: req.params.username})
    .select('courses')
    .populate('_courses', 'code title')
    .exec((err, student) => {
      if (err) return res.status(400).json({err_msg: err.message});
      // ( async function loadCourses() {
      //     courses = await Course.find({code: {$in: courses}})
      //     res.json({courses: courses});
      // })();
      res.json({data: student._courses})
    })
})

// add new courses
router.post('/:username/courses', (req, res) => {
  let username = req.params.username;
  let course_codes = req.body.course_codes;

  Student.findOne({username})
    .exec((err, student) => {
      if (err) return res.status(400).json({err_messg: err.message});
      // remove course duplicates using Set data structure
      let courseSet = new Set([...student.courses, ...course_codes]);
      student.courses = [...courseSet];
      student.save((err, newDoc) => {
        if (err) return res.status(400).json({err_messg: err.message});
        res.json({data: newDoc});
      })
    })

  // let insert_query = `INSERT INTO student_course_join_tbl (student_id, course_id) values `;
  // let student_courses_array = [];
  // course_ids.forEach((c_id, index) => {
  //   console.log(c_id, "  ", index);
  //   student_courses_array.push(student_id, c_id);
  //   insert_query = insert_query.concat(index == (course_ids.length - 1) ? `(?, ?);` : `(?, ?), `);
  // });

  // req.db.run(insert_query, student_courses_array, (err, results) => {
  //   if (err) res.status(400).json({'err_msgg': err.message});
  //   else {
  //     // res.json({'data': results});
  //     req.db.all('SELECT * FROM student_course_join_tbl', [], (err, results) => {
  //       if (err) return res.status(400).json({err_messg: err.message});
  //       res.json({data: results});
  //     })
  //   }
  // })
})
  
router.post('/signin', (req, res) => {
  const {username, password} = req.body;
  // let select_query = `SELECT * FROM student_tbl where (username = ? AND password = ?)`;
  // req.db.get(select_query, [username, md5(password)], (err, result) => {
  //   if (err) res.status(400).json({err_msg: err.message});
  //   else {
  //     res.json({'data': result});
  //   }
  // })
  
  Student.findOne({username}).exec((err, student) => {
    if (err) res.status(400).json({err_msg: err.message});
    if (!student || (student.password != md5(password)) ) {
      res.status(401).json({msg: 'Incorrect Login details'})
    } else {
      res.json({'data': student});
    }
  })
});

router.post('/signup', (req, res) => { 
  const formBody = {username, name, password, email, phone, courses} = req.body;
  if (password != req.body.confirmPassword) {
    return res.status(404).json({'err_msg': 'Passwords do not match!'});
  }
  Student.findOne({username}).exec((err, existingStudent) => {
    if (err) return res.status(400).json({err_msg: err.message});
    if (existingStudent) {
      return res.status(400).json({err_msg: 'username is already taken!'});
    } else {
      Student.create({...formBody, password: md5(password)}, (err, newStudent) => {
          if (err) res.status(400).json({'err_msg': err.message});
          else {
            res.json({'data': newStudent});
          }
      })
    }
  })
  // let select_query = `SELECT * FROM student_tbl where (username = ? AND password = ?)`;
  // req.db.get(select_query, [username, md5(password)], (err, result) => {
  //   if (err) return res.status(400).json({err_msg: err.message});
  //   if (result) res.status(400).json({err_msg: 'username is already taken!'});
  //   else {
  //     let insert_query = `INSERT INTO student_tbl (name, username, password) values (?, ?, ?)`;
  //     req.db.run(insert_query, [name, username, md5(password)], (err, result) => {
  //       if (err) res.status(400).json({'err_msg': err.message});
  //       else {
  //         res.json({'data': result});
  //       }
  //     });
  //   }
  // })

});


module.exports = router;