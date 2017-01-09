var express = require('express');
var router = express.Router();
var  mongoose =  require('mongoose');
// 加载mongoDB数据模型集
const User = require('../models/User');
/*加载函数库
 Underscor.js定义了一个下划线（_）对象，类似jquery的$
 函数库的所有方法都属于这个对象。这些方法大致上可以分成：
 集合（collection）、数组（array）、函数（function）、
 对象（object）和工具（utility）五大类
 说白了就是一个对以上数据有强大处理能力的模块*/
var _ =require('underscore');
mongoose.connect('mongodb://127.0.0.1:27017/Movie');
mongoose.Promise = require('bluebird');
/*
通过req.param('userid')来拿参数时，参数的来源有优先级。
例：
/user/signup/1111?userid=1112
{userid:1113}
1111：路由里的参数；1112：url里参数；1113：后台data里的参数

优先级顺序：1111 > 1113 > 1112*/
/* GET users/signup  listing. */
router.post('/signup', function(req, res, next) {
 /* req.param('user') 获取顺序
 先从路由中获取，再从body中获取，再从query中获取参数
  req.params，从路由中获取参数
  req.body,从提交的表单中获取参数
  req.query，从url的?中获取参数*/
  const _user = req.body.user;
//查询数据库有没有注册过
  User.findOne({name:_user.name},(err,user)=>{
    if(err) console.log(err)
    //注册过
    if(user){
      return res.redirect('/')
    }else{
      const user=new User(_user)
      user.save(function(err,user){
        if(err){
          console.log(err)
        }
        res.redirect('/users/userlist')
      })
    }
  })

});
/* GET users/signin  listing. */
router.post('/signin', function (req, res, next) {
  const _user = req.body.user;
  const name = _user.name;
  const password = _user.password;

  User.findOne({name: _user.name}, (err, user)=> {
    if (err) console.log(err);

    if (!user) {
      res.redirect('/');
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) console.log(err);

      else if (isMatch) {
        console.log('密码匹配正确')
        req.session.user = user;//把user写到客户端
        res.redirect('/');
      }

      else console.log('no!!!23')
    })
  });
});
router.get('/userlist', function(req, res, next) {
  User.fetch(function (err, users) {
    if (err) console.log(err)
    
    res.render('userlist',{
      title:'用户列表页',
      users:users
    })

  })
});
module.exports = router;
