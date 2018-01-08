"use strict";

const assert = require("chai").assert;
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const ChatServer = require("../../src/chatserver/chatserver");

var io = require('socket.io-client');
var options = {transports: ['websocket'], 'force new connection': true};

// var chatUser1 = {'name': 'Andy'};
// var chatUser2 = {'name': 'Martin'};

describe("Chat server", function() {
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
    describe("Test user connect, send message and disconnect", function() {
        it("Should emit message and user to all connected clients", function(done) {
            this.timeout(5000);
            var http = new ChatServer().http;
            var client1;
            var client2;

            http.listen(1337, async () => {
                var socketURL = 'http://localhost:1337';

                client1 = io.connect(socketURL, options);

                var user1 = {
                    name: "fafbakf",
                    pw: "lsgknsln",
                    city: "Karlskrona",
                    admin: true
                };

                var user2 = {
                    name: "rgsgs",
                    pw: "rhbrhgerdh",
                    city: "Karlskrona",
                    admin: true
                };

                client1.on('chat message', function(data) {
                    if (data.user != "Server") {
                        assert.equal(data.user, "rgsgs");
                        assert.equal(data.avatar, "https://gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?size=35");
                        client1.disconnect();
                        client2.disconnect();
                        http.close();
                        done();
                    } else {
                        assert.equal(data.user, "Server");
                        assert.equal(data.avatar, "https://i.stack.imgur.com/SE2cv.jpg");
                    }
                });

                client1.on('connect', function() {
                    client1.emit('new user', user1, function() {
                        return;
                    });

                    client2 = io.connect(socketURL, options);

                    client2.on('connect', function() {
                        client2.emit('new user', user2, function() {
                            return;
                        });
                        client2.emit('chat message', "My name is Martin.");
                    });
                });
            });
        });
    });
});
