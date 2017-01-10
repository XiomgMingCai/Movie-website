const Movie = require('../models/movis')
/* GET home page. */
exports.index = function (req, res) {
    console.log('user in session !')
    console.log(req.session.user);
    var user = req.session.user || null;
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('index', {
            title: '电影-首页',
            movies: movies,
            user: user
        });
    })
};