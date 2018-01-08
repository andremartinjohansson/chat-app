"use strict";

var express = require('express');
var router = express.Router();

router.get("/", async (req, res) => {
    var info, suc;

    if (req.session['reg_success']) {
        suc = req.session['reg_success'];
    } else if (req.session['reg']) {
        info = req.session['reg'];
    }
    res.render("index", {
        message: info,
        success: suc
    });
});

router.get("/register", async (req, res) => {
    if (req.session['reg']) {
        var info = req.session['reg'];
    }
    res.render("register", {
        message: info
    });
});

module.exports = router;
