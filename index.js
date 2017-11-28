#!/usr/bin/env node
"use strict";

const ChatServer = require("./src/chatserver/chatserver");
var http = new ChatServer().http;

// Start up server
var port = (!isNaN(process.env.DBWEBB_PORT) ? +process.env.DBWEBB_PORT : 1337);

http.listen(port, function() {
    console.log("Running on port " + port);
});
