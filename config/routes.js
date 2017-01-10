var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Movie');
mongoose.Promise = require('bluebird');
module.exports = function (app) {

    var Index = require('../app/controllers/index');
    var User = require('../app/controllers/user.js');
    var Movie = require('../app/controllers/movie');


    app.get('/', Index.index);

    app.post('/users/signup', User.signup);
    app.post('/users/signin', User.signin);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.get('/users/logout', User.logout);
    app.get('/users/user/list', User.signinRequired, User.adminRequired, User.userlist);

    app.get('/movie/:id', Movie.detail);
    app.get('/admin/movie/new', User.signinRequired, User.adminRequired,Movie.new);
    app.get('/admin/movie/update/:id',User.signinRequired, User.adminRequired, Movie.update)
    app.post('/admin/movie', User.signinRequired, User.adminRequired,Movie.save);
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired,Movie.list);
    app.delete('/admin/list',User.signinRequired, User.adminRequired, Movie.del)
};

