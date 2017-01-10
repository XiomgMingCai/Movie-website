const User = require('../models/user');




exports.showSignin = function (req, res, next) {

    res.render('signin', {
        title: '用户列表页',
    })
}
exports.showSignup = function (req, res, next) {

    res.render('signup', {
        title: '用户列表页',
    })
}

exports.signup = function (req, res, next) {
    /* req.param('user') 获取顺序
     先从路由中获取，再从body中获取，再从query中获取参数
     req.params，从路由中获取参数
     req.body,从提交的表单中获取参数
     req.query，从url的?中获取参数*/
    const _user = req.body.user;
//查询数据库有没有注册过
    User.findOne({name: _user.name}, (err, user)=> {
        if (err) console.log(err)
        //注册过
        if (user) {
            return res.redirect('/signin')//用户名已经能在数据库查到了
        } else {
            const user = new User(_user)
            user.save(function (err, user) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/')
            })
        }
    })

};
/* GET users/signin  listing. */
exports.signin = function (req, res, next) {
    const _user = req.body.user;
    const name = _user.name;
    const password = _user.password;

    User.findOne({name: _user.name}, (err, user)=> {
        if (err) console.log(err);

        if (!user) {
            res.redirect('/');/*用户不存在*/
        }

        user.comparePassword(password, function (err, isMatch) {
            if (err) console.log(err);

            else if (isMatch) {
                console.log('密码匹配正确')
                req.session.user = user;//把user写到客户端
                res.redirect('/');
            }

            else return res.redirect('/signin');/*密码不正确*/
        })
    });
};
// logout
exports.logout = function (req, res, next) {
    delete req.session.user
    // delete app.locals.user

    res.redirect('/')
};

exports.userlist = function (req, res, next) {
    User.fetch(function (err, users) {
        if (err) console.log(err);

        res.render('userlist', {
            title: '用户列表页',
            users: users
        })

    })
};
/*是否登录*/
exports.signinRequired = function (req, res, next) {
    var user = req.session.user
    if(!user){
        return res.redirect('/signin')
    }
    next();
}
/*权限控制*/
exports.adminRequired = function (req, res, next) {
    var user = req.session.user
    if(user.role <= 10 ){
        return res.redirect('/signin')
    }
    next();
};
    