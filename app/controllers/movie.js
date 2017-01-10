const Movie = require('../models/movis');
var _ =require('underscore');

//访问路径就是localhost :3000/movie/id
exports.detail = function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: '详情' + movie.title,
            movie: movie
        });
    })

};
// 加载admin page
exports.new = function (req, res) {
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
};

//admin update movie
exports.update = (req, res)=> {
    const id = req.params.id

    if (id) {
        Movie.findById(id, (err, movie)=> {
            res.render('admin', {
                title: '电影后台录入页',
                movie: movie
            })
        })
    }
}


//admin post movie  录入页面 urlencoded,
exports.save = function (req, res) {

    if (!req.body) return res.sendStatus(400);

    var id = req.body.movie._id
    var movieObj = req.body.movie;
    var _movie;

    if (id != 'undefined' && id != '') {

        console.log('take hello');
        console.log(id);

        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
             _movie = _.extend(movie, movieObj);
            _movie.save(function (err, _movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + _movie._id);
            });
        });

    } else {

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
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        });

    }


};

// 加载list page
exports.list = function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: '电影列表',
            movies: movies,
        });
    });
};
//list delete movie
exports.del = (req, res)=> {
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
};