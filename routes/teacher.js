const router = require('express').Router();
const md5 = require('md5');
const Teacher = require('../models/teacher');


router.get('/', (req, res) => {
  // let select_query = `SELECT * FROM teacher_tbl`;
  // req.db.all(select_query, [], (err, rows) => {
  //   if (err) res.status(400).json({err_msg: err.message});
  //   else {
  //     res.json({data: rows});
  //   }
  // })

  Teacher.find().exec((err, teachers) => {
    if (err) res.status(400).json({err_msg: err.message});
    else {
      res.json({data: teachers});
    }
  })
})

router.post('/signin', (req, res) => {
  // let select_query = `SELECT * FROM teacher_tbl where (username = ? AND password = ?)`;
  // req.db.get(select_query, [username, md5(password)], (err, result) => {
  //   if (err) res.status(400).json({err_msg: err.message});
  //   else {
  //     res.json({'data': result});
  //   }
  // })
  let {username, password} = req.body;
  console.log(req.body);
  Teacher.findOne({username})
  // .select('-password -courses -name -_id')
  .exec((err, teacher) => {
    if (err) res.status(400).json({err_msg: err.message});
    if (!teacher || (teacher.password != md5(password)) ) {
      res.status(401).json({msg: 'Incorrect Login details'})
    } else {
      res.json({'data': teacher});
    }
  })
});

router.post('/signup', (req, res) => {
  const formBody = {username, name, password} = req.body;
  if (password != req.body.confirmPassword) {
    return res.status(404).json({err_msg: 'Passwords do not match!'});
  }
  // let select_query = `SELECT * FROM teacher_tbl where (username = ? AND password = ?)`;
  // req.db.get(select_query, [username, md5(password)], (err, result) => {
  //   if (err) return res.status(400).json({err_msg: err.message});
  //   if (result) res.status(400).json({err_msg: 'username is already taken!'});
  //   else {
  //     let insert_query = `INSERT INTO teacher_tbl (name, username, password) values (?, ?, ?)`;
  //     req.db.run(insert_query, [name, username, md5(password)], (err, result) => {
  //       if (err) res.status(400).json({'err_msg': err.message});
  //       else {
  //         res.json({'data': result});
  //       }
  //     });
  //   }
  // })

  Teacher.findOne({username}).exec((err, existingTeacher) => {
    if (err) return res.status(400).json({err_msg: err.message});
    if (existingTeacher) {
      return res.status(400).json({err_msg: 'username is already taken!'});
    } else {
      Teacher.create({...formBody, password: md5(password)}, (err, newTeacher) => {
          if (err) res.status(400).json({'err_msg': err.message});
          else {
            res.json({'data': newTeacher});
          }
      })
    }
  })
});

router.get('/:username/courses', (req, res) => {
  let username = req.params.username;
  Teacher.findOne({username})
    .select('-_id courses username')
    .populate('_courses', 'code title')
    .exec((err, {courses}) => {
      if (err) return res.status(400).json({err_msg: err});
      res.json({data: courses});
    })
})

router.post('/:username/courses/add', (req, res) => {
  let username = req.params.username;
  let course_codes = req.body.course_codes;
  Teacher.findOne({username})
    .exec((err, teacher) => {
      if (err) return res.status(400).json({err_msg: err});
      let courseSet = new Set([...teacher.courses, ...course_codes]);
      teacher.courses = [...courseSet];
      teacher.save((err, updatedDoc) => {
        if (err) return res.status(400).json({err_msg: err});
        res.json({data: updatedDoc});
      })
    })
})

module.exports = router;