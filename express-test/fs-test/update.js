var fs = require("fs");
module.exports = function (req, res, next) {
    var path = req.store + "/" + req.params.filename;
    var data = req.body.data;
    fs.writeFile(path, data, {
        flag: "r+"
    }, function (error) {
        if(error){
            return res.sendStatus(400)
        }
        res.sendStatus(200);
    });
};