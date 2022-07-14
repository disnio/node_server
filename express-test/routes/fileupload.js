/**
 * Created by Administrator on 2016/11/8.
 */


module.exports.get = function (req, res, next) {
    res.render('fileupload')
};

module.exports.post = function (req, res, next) {
    var formidable = require('formidable');
    var fs = require('fs');
    var util = require('util');
    var path = require("path");

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "../upload/");
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req, function (err, fields, files) {
        console.log(files);
        // 普通上传input:file 命名是 file,  jquery.file.Upload 是 files[]
        console.log("fields: ", fields);

        var lstart = form.uploadDir.length;
        var result = [];
        var redirect = fields.redirect;
        var rpath;
        if (files.file.length > 1) {
            files.file.forEach(function (v, i) {
                var s = {};
                s.path = v.path.substr(lstart);
                s.name = v.name;
                s.type = v.type;
                s.size = v.size;
                result[i] = s;
            });
            if (fields.redirect) {
                rpath = redirect.replace('%s', '') + JSON.stringify(result);
                res.redirect(rpath);
                return;
            }
            res.json({files: result});
        } else {
            var s = {};
            s.path = files.file.path.substr(lstart);
            s.name = files.file.name;
            s.type = files.file.type;
            s.size = files.file.size;
            if (fields.redirect) {
                rpath = redirect.replace('%s', '') + JSON.stringify(s);
                res.redirect(rpath);
                return;
            }
            res.json({files: [s]});
        }
    });
    form.on('fileBegin', function (name, file) {
        var date = new Date();
        var pth = date.toLocaleDateString().split(/\-|\//).join("") + "_" + date.toTimeString().split(" ")[0].split(":").join("") + "_" + date.getMilliseconds();
        file.path = path.join(path.dirname(file.path), pth + path.extname(file.name));
        // console.log("fileBegin: ", file);
    });

    form.on('field', function (name, value) {
        console.log("on: ", name + ": ", JSON.stringify(value));
    });
};

