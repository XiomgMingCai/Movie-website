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
    app.get('/users/logout', User.logout);
    app.get('/users/userlist', User.userlist);

    app.get('/movie/:id', Movie.detail);
    app.get('/admin/new', Movie.new);
    app.get('/admin/update/:id', Movie.update)
    app.post('/admin/movie', Movie.save);
    app.get('/admin/list', Movie.list);
    app.delete('/admin/list', Movie.del)
};

