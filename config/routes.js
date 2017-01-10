var express = require('express');
var  mongoose =  require('mongoose');
// 加载mongoDB数据模型集
const Movie = require('../app/models/movis');
/*加载函数库
 Underscor.js定义了一个下划线（_）对象，类似jquery的$
 函数库的所有方法都属于这个对象。这些方法大致上可以分成：
 集合（collection）、数组（array）、函数（function）、
 对象（object）和工具（utility）五大类
 说白了就是一个对以上数据有强大处理能力的模块*/
var _ =require('underscore');
// 加载mongoDB数据模型集
const User = require('../app/models/User');
/*加载函数库
 Underscor.js定义了一个下划线（_）对象，类似jquery的$        
 函数库的所有方法都属于这个对象。这些方法大致上可以分成：
 集合（collection）、数组（array）、函数（function）、
 对象（object）和工具（utility）五大类
 说白了就是一个对以上数据有强大处理能力的模块*/
var _ =require('underscore');
mongoose.connect('mongodb://127.0.0.1:27017/Movie');
mongoose.Promise = require('bluebird');
module.exports = function (app) {
    

/* GET home page. */
app.get('/', function (req, res) {
    console.log('user in session !')
    console.log(req.session.user);
    var user =req.session.user||null;
    Movie.fetch(function (err, movies) {
        if(err){
            console.log(err);
        }

        res.render('index',{
            title:'电影-首页',
            movies:movies,
            user:user
        });
    })
});

// 加载detail page
//访问路径就是localhost :3000/movie/id
app.get('/movie/:id', function (req, res) {
    var id = req.params.id;

    Movie.findById(id,function (err,movie){
        res.render('detail',{
            title:'详情'+movie.title,
            movie:movie
        });
    })

})
// 加载admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: 'movie 后台录入页',
        movie: {
            director: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
})

//admin update movie
app.get('/admin/update/:id', (req, res)=> {
    const id = req.params.id

    if(id){
        Movie.findById(id,(err,movie)=>{
            res.render('admin',{
                title:'电影后台录入页',
                movie:movie
            })
        })
    }
})


//admin post movie  录入页面 urlencoded,
app.post('/admin/movie/new', function(req, res) {

    if(!req.body) return res.sendStatus(400);

    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if( id != 'undefined' && id != '' ) {

        console.log('take hello');
        console.log(id);

        Movie.findById(id, function(err,movie) {
            if(err){
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, _movie) {
                if(err){
                    console.log(err);
                }
                res.redirect('/movie/'+_movie._id);
            });
        });

    }else{

        _movie = new Movie({
            title: movieObj.title,
            doctor: movieObj.doctor,
            country: movieObj.country,
            language: movieObj.language,
            poster: movieObj.poster,
            flash: movieObj.flash,
            year: movieObj.year,
            summary: movieObj.summary
        });
        _movie.save(function(err,movie){
            if(err){
                console.log(err);
            }
            res.redirect('/movie/'+movie._id);
        });

    }


});

// 加载list page
app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
        res.render('list',{
            title : '电影列表',
            movies: movies,
        });
    });
});
//list delete movie
app.delete('/admin/list', (req, res)=> {
    // req.query 主要获取到客户端提交过来的键值对
    // '/admin/list?id=12'，这里就会获取到12
    const id = req.query.id

    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err)
            }
            else {
                res.json({success: 1})
            }
        })
    }
})
    /////////////////////////////


    /*
     通过req.param('userid')来拿参数时，参数的来源有优先级。
     例：
     /user/signup/1111?userid=1112
     {userid:1113}
     1111：路由里的参数；1112：url里参数；1113：后台data里的参数

     优先级顺序：1111 > 1113 > 1112*/
    /* GET users/signup  listing. */
    app.post('/users/signup', function(req, res, next) {
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
    app.post('/users/signin', function (req, res, next) {
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
// logout
    app.get('/users/logout', function(req, res, next) {
        delete req.session.user
        // delete app.locals.user

        res.redirect('/')
    });
    app.get('/users/userlist', function(req, res, next) {
        User.fetch(function (err, users) {
            if (err) console.log(err)

            res.render('userlist',{
                title:'用户列表页',
                users:users
            })

        })
    });
    
};

