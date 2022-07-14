/**
 * Created by Administrator on 2016/11/8.
 */
var upload = require('./fileupload'),
    index = require('./index'),
    cors = require('./cors');

module.exports = function (app) {
    app.get('/', index);
    app.get('/fileupload', upload.get);
    app.post('/fileupload', upload.post);

    app.get('/cors', cors.get);
    app.post('/cors', cors.post);
    
    app.get("/result", function (req, res) {
        res.render('result')
    });

    app.get('/file/:name', function (req, res, next) {

        var options = {
            root: __dirname + '/upload/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        var fileName = req.params.name + ".jpg";
        res.sendFile(fileName, options, function (err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            }
            else {
                console.log('Sent:', fileName);
            }
        });
        next();

    });

};
