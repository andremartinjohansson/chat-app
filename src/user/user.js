/**
 * A module for creating new users.
 *
 * @module
 */
"use strict";

class User {
    /**
     * @constructor
     *
     * @param {object} options - Configure by sending options.
     */
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }



    /**
     * Get the user's username
     * @return  {string} Username
     */
    getUsername() {
        return this.username;
    }



    /**
     * Get the user's password in plain text
     * @return  {string} Password
     */
    getPassword() {
        return this.password;
    }
}

module.exports = User;
