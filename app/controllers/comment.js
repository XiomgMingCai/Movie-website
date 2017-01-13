const Comment = require('../models/comment');
/* post Comment page. */
exports.save = function (req, res) {
    var _comment = req.body.comment;
    console.log(_comment)
    var movieID = _comment.movie;
    var comment = new Comment(_comment)

    comment.save(function (err, comment) {
        if (err) {
            console.log(err);
        }

        res.redirect('/movie/'+ movieID);
    })
};