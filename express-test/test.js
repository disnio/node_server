var express = require("express");
var http = require("http");
var path = require("path");
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var methodOverride = require('method-override');
var session = require('express-session');
var compression = require('compression');

var csrf = require('csurf');

var errorHandler = require('errorhandler');
var notifier = require('node-notifier');

var favicon = require('serve-favicon');
var serveIndex = require('serve-index');

var app = express();
var port = process.env.port || 7000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//要放在响应的最外
app.use(morgan('dev'));

app.use(compression({
    threshold: 1
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(session({ secret: 'pig', name: "_csrf", cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
//跨域获取时候要禁止csrf
// app.use(csrf());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//必须以子目录存在
app.use('/images', serveIndex("upload/images", { 'icons': true, 'view': 'details' }));

//日志在静态内容后面
app.all('*', function (req, res, next) {
    // 带 cookie 发送文件响应必须明确设置域，不能简单的用 *
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "HEAD, PUT, POST, GET, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Content-Range, Content-Disposition, Content-Description");
    res.header("Access-Control-Allow-Credentials", true);
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

require('./routes/routes')(app);

// no stack traces leaked to user
// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {
//             status: err.status,
//             stack: err.stack
//         }
//     });
// });
app.use(errorHandler());
// server start
var server = http.createServer(app);
server.listen(port, function () {
    console.log("App listen runing on port:", port);
});
