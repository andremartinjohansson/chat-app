"use strict";

const assert = require("chai").assert;
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

this.jsdom = require('jsdom-global')();
global.$ = global.jQuery = require('jquery');

describe("Socket client", function() {
    describe("Get and run on-ready function", function() {
        it("Should be defined and run without errors", function(done) {
            var io = require('socket.io-client');
            var socket = require("../../static/js/socket.js");

            socket.client(io);
            assert.isFunction(socket.client);
            done();
        });
    });
    describe("Get and run updateScroll function", function() {
        it("Should be defined and run without errors", function(done) {
            var socket = require("../../static/js/socket.js");
            var messages = document.createElement('div');

            messages.setAttribute("id", "messages");
            document.body.append(messages);

            socket.updateScroll();
            assert.isFunction(socket.updateScroll);
            done();
        });
    });
    describe("Run image function", function() {
        it("Should return image tag or false", function(done) {
            var socket = require("../../static/js/socket.js");
            var tag = socket.imageLink("[img]https://www.w3schools.com/w3css/img_fjords.jpg[/img]");
            var noImage = socket.imageLink("lol");

            assert.equal(tag, '<img class="chat-img" src="https://www.w3schools.com/w3css/img_fjords.jpg">');
            assert.equal(noImage, false);
            done();
        });
    });
    describe("Run video function", function() {
        it("Should return video frame or false", function(done) {
            var socket = require("../../static/js/socket.js");
            var tag = socket.videoLink("[video]OQsIV8fkgSA[/video]");
            var noVideo = socket.videoLink("lol");

            assert.equal(tag, '<iframe width="560" height="315" src="https://www.youtube.com/embed/OQsIV8fkgSA" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>');
            assert.equal(noVideo, false);
            done();
        });
    });
    describe("Test embedImg button", function() {
        it("Should add the shortcode to the input", function(done) {
            var io = require('socket.io-client');
            var socket = require("../../static/js/socket.js");
            var button = document.createElement('button');
            var input = document.createElement('input');

            button.setAttribute("id", "embedImg");
            input.setAttribute("id", "m");
            document.body.append(button);
            document.body.append(input);
            socket.client(io);
            document.getElementById('embedImg').click();

            assert.equal(document.getElementById('m').value, "[img]https://www.w3schools.com/w3css/img_fjords.jpg[/img]");
            done();
        });
    });
    describe("Test embedVideo button", function() {
        it("Should add the shortcode to the input", function(done) {
            var io = require('socket.io-client');
            var socket = require("../../static/js/socket.js");
            var button = document.createElement('button');
            var input = document.createElement('input');

            button.setAttribute("id", "embedVideo");
            input.setAttribute("id", "m");
            document.body.append(button);
            document.body.append(input);
            socket.client(io);
            document.getElementById('embedVideo').click();

            assert.equal(document.getElementById('m').value, '[video]OQsIV8fkgSA[/video]');
            done();
        });
    });
});
