var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 몽구스 연결
var mongoose = require('mongoose');

// 1. require, rest용
var bakeryRouter = require('./routes/bakery');
var userRouter = require('./routes/user');
var reviewRouter = require('./routes/review');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads'))); // url 사용을 위해 uploads 폴더를 static 폴더로 사용

// 몽구스 연결
mongoose.connect("mongodb://cindy:abcd1234@127.0.0.1:27017/bread")
mongoose.connection;

// 2. 주소 설정
app.use('/api/bakery', bakeryRouter);
app.use('/api/user', userRouter);
app.use('/api/review', reviewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
