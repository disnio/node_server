var async = require("async");
var request = require("request");
var os = require("os");

var base = "http://localhost:8000";
var file = "foo.txt";
var url = base + "/" + file;
function create(callback) {
    request({
        uri: url,
        method: "post",
        form: {
            data: "This is a test file." + os.EOL
        }
    }, function (error, response, body) {
        console.log("create: ", response.statusCode );
        callback(error);
    });
}

function read(callback) {
    request({
        uri: url,
        // json: true
    }, function (error, response, body) {
        console.log("read: ", response.statusCode);
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
        callback(error)
    });
}

function update(callback) {
    request({
        uri: url,
        method: "put",
        form: {
            data: "This file has been update." + os.EOL
        }
    }, function (error, response, body) {
        console.log("update: ", response.statusCode);
        callback(error);
    })
}

function del(callback) {
    request({
        uri: url,
        method: "delete"
    }, function (error, response, body) {
        console.log("del: ", response.statusCode);
        callback(error)
    });
}

async.waterfall([
    del, read
]);