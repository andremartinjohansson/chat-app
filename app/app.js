"use strict";

// Init the app
const path = require("path");
var express = require("express");
var app = express();
var bodyParser = require('body-parser');

app.set('view engine', 'pug');
var staticFiles = path.join(__dirname, "../static");

app.use(express.static(staticFiles));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
var index = require('../routes/index');
var mongodb = require('../routes/mongodb');

app.use('/', index);
app.use('/mongodb', mongodb);

// 404
app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    err.status = err.status || 500;
    res.status(err.status);
    res.render("error", {
        error: err
    });
});

module.exports = app;
