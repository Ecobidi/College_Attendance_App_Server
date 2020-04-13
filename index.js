const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

// SQLite Database
// const db = require('./database/');
const {APP_NAME, PORT, DB_PATH} = require('./config');

// connect to db
mongoose.connect(DB_PATH);

mongoose.connection.once('open', () => console.log('db connected'));

mongoose.connection.on('error', () => console.log('db error occurred'));

mongoose.set('debug', true);

//routes
const attendanceRoutes = require('./routes/attendance');
const courseRoutes = require('./routes/course');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');

// init app
const app = express();

// my SQLite database middleware
app.use((req, res, next) => {
  //req.db = db;
  next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
}));

app.use((req, res, next) => {
  req.session.user = req.session.user;
  res.locals.user = req.session.user || null;
  next();
});

// routers
app.use('/attendance', attendanceRoutes);
app.use('/courses', courseRoutes);
app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);

// error handler
app.use((req, res) => {
  res.status(404).json({err_msg: 'The resource you requested doesn\'t exist!'})
})

app.listen(PORT, () => { console.log(APP_NAME, ' running on port ', PORT)});