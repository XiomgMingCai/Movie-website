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
/*由于HTTP协议传输数据 是无状态的协议一但数据交换完成 服务端和客户端的链接就会关闭 再次交换就需要建立新的链接
 * 意味着服务器无法无法从链接上跟踪会会话了 所有就需要session(通过服务器端记录来确定身份)
 * ||(cookie通过客户端记录来确定用户身份) 来弥补*/
var session = require('express-session'); //如果要使用session，需要单独包含这个模块
var bcrypt = require("bcryptjs"); //bcrypt加密引用
var mongoStore = require("connect-mongo")(session); //持久化session 的写法详见参考connect-mongo API
var dbUrl = "mongodb://127.0.0.1:27017/Movie";
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
  secret:'react',         // 设置的secret字符串，来计算hash值并放在cookie中
  resave: false,                                    // session变化才进行存储
  saveUninitialized: true,
  // 使用mongo对session进行持久化，将session存储进数据库中
  store: new mongoStore({
    url: dbUrl,                                     // 本地数据库地址
    collection: 'sessions'                          // 存储到mongodb中的字段名
  })
}));


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
app.use(function (req, res, next) {
  var _user = req.session.user;
  if (_user) {
    app.locals.user = _user;
    next()
  } else {
    return next()
  }

});
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
