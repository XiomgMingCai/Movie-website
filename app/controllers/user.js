const User = require('../models/user');
/*
 通过req.param('userid')来拿参数时，参数的来源有优先级。
 例：
 /user/signup/1111?userid=1112
 {userid:1113}
 1111：路由里的参数；1112：url里参数；1113：后台data里的参数

 优先级顺序：1111 > 1113 > 1112*/
/* GET users/signup  listing. */
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
            return res.redirect('/')
        } else {
            const user = new User(_user)
            user.save(function (err, user) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/users/userlist')
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
    