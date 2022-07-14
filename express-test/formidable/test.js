var express = require("express");
var http = require("http");
var path = require("path");
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
// var bodyParser = require("body-parser");
var formidable = require("formidable");
var util = require("util");
var app = express();
var port = process.env.port || 8000;
var fs = require("fs");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan(':date[iso] :method :url :status :response-time ms - :res[content-length]'));

app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.text());

app.use(express.static(path.join(__dirname, 'public')));

app.post("/", function (req, res) {
    // console.log(req.body, req.params);
    var form = new formidable.IncomingForm();
    form.uploadDir =  path.join(__dirname, "/upload/");
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });
    form.on('fileBegin', function(name, file) {
        var date = new Date();
        var pth = date.toLocaleDateString().split(/\-|\//).join("") + "_" + date.toTimeString().split(" ")[0].split(":").join("") + "_" + date.getMilliseconds();
        file.path = path.join(path.dirname(file.path), pth + path.extname(file.name));
        // console.log("fileBegin: ", file);
    });

    form.on('field', function(name, value) {
        console.log(name + ": ", JSON.stringify(value));
    });
});

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