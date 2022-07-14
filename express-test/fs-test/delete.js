var fs = require("fs");
module.exports = function (req, res, next) {
    var path = req.store + "/" + req.params.filename;
    
    fs.unlink(path, function (error) {
        if(error){
            return res.sendStatus(400);
        }
        res.sendStatus(200);
    })
};