const router = require('express').Router();
const Course = require('../models/course');
const Teacher = require('../models/teacher');

router.get('/', (req, res) => {
  let prev_id = req.query.prev_id || undefined;
  let limit = req.query.limit || 20;
  Course.find()
    .sort({_id: 1})
    //.where('_id').gt(prev_id)
    .limit(limit)
    .exec((err, courses) => {
      if (err) return res.status(400).json({message: err.message});
      res.json({data: courses});
    })
  // req.db.all(`SELECT * FROM course_tbl`, [], (err, rows) => {
  //   if (err) res.status(400).json({'message': err.message});
  //   else {
  //     res.json({'data': rows});
  //   }
  // })
});

router.post('/', (req, res) => {
  const {title, code, teacher} = req.body;
  Course.findOne({code})
  .exec((err, course) => {
    if (course) return res.status(400).json({message: 'Same Course Code already exists!'});
    let newCourse = new Course({title, code});
    newCourse.save((err, doc) => {
      if (err) return res.status(400).json({message: err.message});
      Teacher.findOneAndUpdate({username: teacher}, {$addToSet: {courses: code}}, (err, updatedTeacher) => {
        if (err) return res.status(400).json({message: err.message});
        res.json({data: doc});
      })
    });
  });
  // req.db.run(`INSERT INTO course_tbl (title, code) values (?, ?)`, [title, code], (err, result) => {
  //   if (err) return console.log(err);
  //   res.json(result);
  // })
});

module.exports = router;