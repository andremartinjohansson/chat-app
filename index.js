#!/usr/bin/env node
"use strict";

var http = require("./app/app");

// Start up server
var port = (!isNaN(process.env.DBWEBB_PORT) ? +process.env.DBWEBB_PORT : 1337);

http.listen(port, function() {
    console.log("Express running on port " + port);
});
