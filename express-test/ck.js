/**
 * Created by Administrator on 2016/10/24.
 */
var cookieSession = require('cookie-session')
var express = require('express')

var app = express()

app.set('trust proxy', 1)

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))

app.use(function (req, res, next) {
    // Update views
    console.log(req.session.isPopulated)
    req.session.views = (req.session.views || 0) + 1

    // Write response
    res.end(req.session.views + ' views')
})

app.listen(8000)