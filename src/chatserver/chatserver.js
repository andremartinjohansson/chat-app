/**
 * A module for chat using socket.io
 *
 * @module
 */
"use strict";

class ChatServer {
    /**
     * @constructor
     *
     */
    constructor() {
        var app = require("../../app/app");

        this.db = require("../mongodb/mongodb.js").mongoDB('mongodb://localhost:27017/chat', 'messages');
        this.http = require('http').Server(app);
        this.io = require('socket.io')(this.http, {'transports': ['websocket', "\n" +
         'polling']});
        this.connections = [];
        this.users = [];

        this.io.on('connection', socket => {
            this.disconnectUser(socket);
            this.sendMessage(socket);
            this.newUser(socket);
        });
    }



    /**
    * Disconnects the user from chat
    */
    disconnectUser(socket) {
        socket.on('disconnect', () => {
            if (socket.username) {
                this.users.splice(this.users.indexOf(socket.username), 1);
                this.updateUsers();
                this.connections.splice(this.connections.indexOf(socket), 1);
                // console.log(socket.username + ' disconnected');
                // console.log("%s users online", this.connections.length);
                this.io.emit('chat message', {msg: socket.username + " disconnected", user: "Server"});
                this.saveMessage("Server", socket.username + " disconnected");
            }
        });
    }



    /**
    * Sends and emits message to all users connected
    */
    sendMessage(socket) {
        socket.on('chat message', async (data) => {
            if (!socket.username) {
                socket.username = "Server";
            }
            // console.log(socket.username + ': ' + data);
            this.io.emit('chat message', {msg: data, user: socket.username});
            this.saveMessage(socket.username, data);
        });
    }



    /**
    * Connects user to the chat
    */
    newUser(socket) {
        socket.on('new user', (data, callback) => {
            callback(true);
            socket.username = data;
            // console.log(socket.username + ' connected');
            this.users.push(socket.username);
            this.connections.push(socket);
            // console.log("%s users online", this.connections.length);
            this.io.emit('chat message', {msg: socket.username + " connected", user: "Server"});
            this.saveMessage("Server", socket.username + " connected");
            this.updateUsers();
        });
    }



    /**
    * Update list of connected users
    */
    updateUsers() {
        this.io.emit('get users', this.users);
    }


    /**
    * Add message to database
    */
    async saveMessage(name, msg) {
        var item = {
            user: name,
            message: msg
        };

        try {
            await this.db.insert(item);
        } catch (err) {
            return;
        }
    }
}

module.exports = ChatServer;
