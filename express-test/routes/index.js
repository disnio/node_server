/* GET home page. */

module.exports = function (req, res, next) {

    // var sess = req.session;
    // if (sess.views) {
    //     console.log(sess.views);
    //     sess.views++
    // } else {
    //     sess.views = 1;
    // }
    // , csrfToken: req.csrfToken()
    res.render('index', { title: "Home Page" });
    // res.render('index', {title: "Home Page", csrfToken: sess.views});
};
