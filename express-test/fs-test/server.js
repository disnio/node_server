var express = require("express");
var http = require("http");
var path = require("path");
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var routes = require("./routes");

var app = express();
var port = process.env.port || 8000;

app.use(morgan(':date[iso] :method :url :status :response-time ms - :res[content-length]'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    req.store = __dirname + "/public";
    next();
});

routes.mount(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = http.createServer(app);
server.listen(port, function() {
    console.log("App listening on port 8000");
});