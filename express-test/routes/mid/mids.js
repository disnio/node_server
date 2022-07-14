/**
 * Created by Administrator on 2016/11/8.
 */
var express = require('express');
var router = express.Router();
var responseTime = require('response-time');
var timeout = require('connect-timeout');
router.use(responseTime({ digits: 4 }));
router.get("/mid", timeout('1s'), require("./mid"));
module.exports = router;