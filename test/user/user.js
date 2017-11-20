"use strict";

const assert = require("assert");
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const User = require("../../src/user/user");

describe("Get user details", function() {
    describe("Get Username", function() {
        it("Should be doe", function() {
            let user = new User("doe", "doe");
            let username = user.getUsername();

            assert.equal(username, "doe");
        });
    });

    describe("Get Password", function() {
        it("Should be doe", function() {
            let user = new User("doe", "doe");
            let password = user.getPassword();

            assert.equal(password, "doe");
        });
    });
});
