const Movie = require('../models/movis')
var cnblog = require('../controllers/cnode.js')
var article = require('../controllers/article')
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
/* GET home page. */
exports.article = function (req, res) {
    res.render('article')
};

/* GET home page. */
exports.cnode = function (req, res) {
 /*   var requestUrl=  'https://cnodejs.org/';
 var  _cnode = new cnode(requestUrl)
    _cnode.getData(res)*/


    /*        express获取参数有三种方法：官网介绍如下

     Checks route params (req.params), ex: /user/:id
     Checks query string params (req.query), ex: ?id=12
     Checks urlencoded body params (req.body), ex: id=

     1、例如：127.0.0.1:3000/index，这种情况下，我们为了得到index，我们可以通过使用req.params得到，通过这种方法我们就可以很好的处理Node中的路由处理问题，同时利用这点可以非常方便的实现MVC模式；

     2、例如：127.0.0.1:3000/index?id=12，这种情况下，这种方式是获取客户端get方式传递过来的值，通过使用req.query.id就可以获得，类似于PHP的get方法；

     3、例如：127.0.0.1:3000/index，然后post了一个id=2的值，这种方式是获取客户端post过来的数据，可以通过req.body.id获取，类似于PHP的post方法；*/
    var page = req.query.page;
    var tab = req.query.tab;
    var requestUrl = 'https://cnodejs.org/?tab=good';
    if (page != undefined) {
        requestUrl = 'https://cnodejs.org/?tab=' + tab + '&page=' + page;
    }
    console.log("requestUrl=" + requestUrl);
    var blog = new cnblog(requestUrl);
    blog.getData(res);

   
};