"use strict";

const path = require("path");
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var index = path.join(__dirname, "../views/index.html");

    res.sendFile(index);
});

module.exports = router;
