var express = require('express');
var router = express.Router();
var  mongoose =  require('mongoose');
// 加载mongoDB数据模型集
const Movie = require('../models/movis');
/*加载函数库
Underscor.js定义了一个下划线（_）对象，类似jquery的$
函数库的所有方法都属于这个对象。这些方法大致上可以分成：
集合（collection）、数组（array）、函数（function）、
对象（object）和工具（utility）五大类
说白了就是一个对以上数据有强大处理能力的模块*/
var _ =require('underscore');
// mongoose.connect('mongodb://127.0.0.1:27017/Movie');
mongoose.Promise = require('bluebird');

/* GET home page. */
router.get('/', function (req, res) {
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
router.get('/movie/:id', function (req, res) {
    var id = req.params.id;

    Movie.findById(id,function (err,movie){
        res.render('detail',{
            title:'详情'+movie.title,
            movie:movie
        });
    })

})
// 加载admin page
router.get('/admin/movie', function (req, res) {
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
router.get('/admin/update/:id', (req, res)=> {
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
router.post('/admin/movie/new', function(req, res) {

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
router.get('/admin/list',function(req,res){
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
router.delete('/admin/list', (req, res)=> {
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
module.exports = router;

