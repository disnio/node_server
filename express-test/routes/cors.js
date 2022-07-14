/**
 * Created by Administrator on 2016/11/8.
 */
var getRawBody = require('raw-body');
var UAParser = require('ua-parser-js');
var parser = new UAParser();

module.exports.get = function (req, res, next) {
    console.log(req.cookies);
    res.send(req.query);
};

module.exports.post = function (req, res, next) {
    var ua = req.headers['user-agent'];
    var browser = parser.setUA(ua).getBrowser();

    if (browser.name == "IE" && parseInt(browser.major) <= 9 && parseInt(browser.major) >= 8) {
        console.log(browser);
        getRawBody(req, {
            length: req.headers['content-length'],
            limit: '1mb',
            encoding: 'utf8'
        }, function (err, string) {
            if (err) return next(err);
            req.text = string;
            console.log("raw: ", req.text);
            next();
        });
    }
    res.send({txt: req.body.name, cookie: req.cookies});
};