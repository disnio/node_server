module.exports = function (req, res, next) {

    if (req.timeout) {
        return false;
    } else {
        res.send("ok");
    }


};
