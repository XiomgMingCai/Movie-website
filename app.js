var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*加载时间处理模块
 app.locals对象字面量中定义的键值对，
 是可以直接在模板中使用的，
 就和res.render时开发者传入的模板渲染参数一样
 这里是指可以在模板中使用moment方法
 在list.jade中我们需要将数据中的时间转换成mm/dd/yyyy
 那么就需要用到moment，所以这里是为了将该方法能传入到模板中
 这里如果换成app.locals.dateFun = require('moment');
 在list模板中我们就需要 #{dateFun(xxxxx).format(MM/DD/YYYY)}*/
app.locals.moment = require('moment');

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
