"use strict";

const assert = require("chai").assert;
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const ChatServer = require("../../src/chatserver/chatserver");

describe("Get chat server", function() {
    describe("Get server object", function() {
        it("Should be an object", function() {
            var http = new ChatServer().http;

            assert.isObject(http);
        });
    });
    describe("Get io object", function() {
        it("Should be an object", function() {
            var io = new ChatServer().io;

            assert.isObject(io);
        });
    });
    describe("Get users array", function() {
        it("Should be an array", function() {
            var users = new ChatServer().users;

            assert.isArray(users);
        });
    });
    describe("Get connections array", function() {
        it("Should be an array", function() {
            var connections = new ChatServer().connections;

            assert.isArray(connections);
        });
    });
});
