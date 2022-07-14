var async = require("async");
var request = require("request");
var fs = require("fs");

var base = "http://localhost:8000";

var formData = {
    // Pass a simple key-value pair
    my_field: 'my_value',
    // Pass data via Buffers
    my_buffer: new Buffer([1, 2, 3]),
    // Pass data via Streams
    my_file1: fs.createReadStream(__dirname + '/baidu.png'),
    my_file2: fs.createReadStream(__dirname + '/444.jpg')

};
request.post({
    url: base,
    formData: formData
}, function optionalCallback(err, httpResponse, body) {
    if (err) {
        return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
});

