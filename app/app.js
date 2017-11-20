"use strict";

// Init the app
const path = require("path");
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var staticFiles = path.join(__dirname, "../static");

app.use(express.static(staticFiles));

// Routes
var index = require('../routes/index');

app.use('/', index);

// Web Sockets
io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

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

module.exports = http;
