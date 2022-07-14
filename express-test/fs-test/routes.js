var create = require("./create");
var read = require("./read");
var update = require("./update");
var del = require("./delete");

module.exports.mount = function (app) {
    app.post("/:filename", create);
    app.get("/:filename", read);
    app.put("/:filename", update);
    app.delete("/:filename", del);

    app.get("/", function (req, res, err) {
        res.write("<p>hello</p>");
        res.end();
    })
};