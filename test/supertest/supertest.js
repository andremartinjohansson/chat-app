"use strict";

const request = require('supertest');
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

var appModule = require("../../app/app");
var app = appModule.app;

describe('Routes', function () {
    describe('Index', function () {
        it("Should return status code 200", function (done) {
            request(app)
                .get('/')
                .expect(200, done);
        });
    });
    describe('Register', function () {
        it("Should return status code 200", function (done) {
            request(app)
                .get('/register')
                .expect(200, done);
        });
    });
    describe('MongoDB Reset', function () {
        it("Should return redirect status code 302", function (done) {
            request(app)
                .get('/mongodb/reset')
                .expect(302, done);
        });
    });
    describe('New User', function () {
        it("Should return redirect status code 302", function (done) {
            request(app)
                .post('/user/new')
                .send({name: "mock", pw: "mock", email: "mock@mock.com"})
                .expect(302, done);
        });
    });
    describe('Reset Users', function () {
        it("Should return redirect status code 302", function (done) {
            request(app)
                .get('/user/reset')
                .expect(302, done);
        });
    });
});
