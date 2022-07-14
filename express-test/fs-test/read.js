var fs = require("fs");

module.exports = function (req, res, next) {
    var path = req.store + "/" + req.params.filename;
    console.log("path: ", path);
    fs.readFile(path, {
        encoding: "utf8"
    }, function (error, data) {
        if(error){
            return res.sendStatus(404);
        }
        res.send(200, {
            data: data
        });
    })
};