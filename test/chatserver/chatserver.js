"use strict";

const assert = require("chai").assert;
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const ChatServer = require("../../src/chatserver/chatserver");

var io = require('socket.io-client');
var options = {transports: ['websocket'], 'force new connection': true};

var chatUser1 = {'name': 'Andy'};
var chatUser2 = {'name': 'Martin'};

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
    describe("Test new user", function() {
        it("Should broadcast new user to all users", function(done) {
            this.timeout(5000);
            var http = new ChatServer().http;
            var client1, client2;
            var numUsers = 0;

            http.listen(1337, async () => {
                var socketURL = 'http://localhost:1337';

                client1 = io.connect(socketURL, options);

                client1.on('connect', function() {
                    client1.emit('new user', chatUser1.name, function() {
                        return;
                    });

                    client2 = io.connect(socketURL, options);

                    client2.on('connect', function() {
                        client2.emit('new user', chatUser2.name, function() {
                            return;
                        });
                    });
                });

                client1.on('get users', function(data) {
                    numUsers += 1;
                    if (numUsers == 2) {
                        assert.equal(data[0], "Andy");
                        assert.equal(data[1], "Martin");
                        client1.disconnect();
                        client2.disconnect();
                        http.close();
                        done();
                    }
                });
            });
        });
    });
    describe("Test user disconnect", function() {
        it("Should disconnect and remove user from server", function(done) {
            this.timeout(5000);
            var http = new ChatServer().http;
            var client1, client2;
            var numUsers = 0;

            http.listen(1337, () => {
                var socketURL = 'http://localhost:1337';

                client1 = io.connect(socketURL, options);

                client1.on('connect', function() {
                    client1.emit('new user', chatUser1.name, function() {
                        return;
                    });
                });

                client2 = io.connect(socketURL, options);

                client2.on('connect', function() {
                    client2.emit('new user', chatUser2.name, function() {
                        return;
                    });
                });

                client2.on('get users', function(data) {
                    numUsers += 1;
                    if (numUsers == 2) {
                        assert.equal(data[0], "Andy");
                        assert.equal(data[1], "Martin");
                        client1.disconnect();
                    } else if (numUsers == 3) {
                        assert.equal(data[0], "Martin");
                        client2.disconnect();
                        http.close();
                        done();
                    }
                });
            });
        });
    });
    describe("Test send message", function() {
        it("Should send and broadcast message to all users", function(done) {
            this.timeout(5000);
            var http = new ChatServer().http;
            var client1, client2, client3;

            http.listen(1337, () => {
                var socketURL = 'http://localhost:1337';

                client1 = io.connect(socketURL, options);

                client1.on('chat message', function(data) {
                    if (data.user != "Server") {
                        assert.equal(data.msg, "My name is Martin.");
                        assert.equal(data.user, "Martin");
                        client1.disconnect();
                        client2.disconnect();
                        client3.disconnect();
                        http.close();
                        done();
                    } else {
                        assert.equal(data.user, "Server");
                    }
                });

                client1.on('connect', function() {
                    client1.emit('new user', chatUser1.name, function() {
                        return;
                    });

                    client2 = io.connect(socketURL, options);

                    client2.on('connect', function() {
                        client2.emit('new user', chatUser2.name, function() {
                            return;
                        });
                        client2.emit('chat message', "My name is Martin.");
                    });

                    client3 = io.connect(socketURL, options);

                    client3.on('connect', function() {
                        client3.emit('chat message', {msg: "Welcome!", user: "Server"});
                    });
                });
            });
        });
    });
});
