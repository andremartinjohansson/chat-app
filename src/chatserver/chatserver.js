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
        var appModule = require("../../app/app");
        var app = appModule.app;
        var session = appModule.session;
        var sharedsession = require("express-socket.io-session");

        const dsn =  process.env.DB_DSN || "mongodb://localhost:27017/chat";

        this.db = require("mongo-amj").init(dsn, 'messages');
        this.http = require('http').Server(app);
        this.io = require('socket.io')(this.http, {'transports': ['websocket', "\n" +
         'polling']});
        this.io.use(sharedsession(session, {
            autoSave: true
        }));
        this.connections = [];
        this.users = [];
        this.gravatarUrl = require('gravatar-url');

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
                for (var i = 0; i < this.users.length; i++) {
                    if (this.users[i].name == socket.username) {
                        this.users.splice(i, 1);
                        break;
                    }
                }
                this.updateUsers(socket.city);
                this.connections.splice(this.connections.indexOf(socket), 1);
                var dateTime = this.theDate();

                this.io.to(socket.city).emit('chat message', {msg: socket.username + " disconnected", user: "Server", avatar: "https://i.stack.imgur.com/SE2cv.jpg", date: dateTime});
                this.saveMessage("Server", socket.username + " disconnected", "https://i.stack.imgur.com/SE2cv.jpg", socket.city, dateTime);
            }
        });
    }



    /**
    * Sends and emits message to all users connected
    */
    sendMessage(socket) {
        socket.on('chat message', async (data) => {
            if (data != "") {
                if (!socket.username) {
                    socket.username = "Server";
                }
                var gravatar = this.gravatarUrl(socket.email, {size: 35});
                var dateTime = this.theDate();

                // console.log(socket.username + ': ' + data);
                this.io.to(socket.city).emit('chat message', {msg: data, user: socket.username, avatar: gravatar, date: dateTime});
                this.saveMessage(socket.username, data, gravatar, socket.city, dateTime);
            }
        });
    }



    /**
    * Connects user to the chat
    */
    newUser(socket) {
        socket.on('new user', async (data, callback) => {
            var user, messages;

            if (data.admin) {
                user = [data];
                user[0].email = "test@test.com";
                messages = [];
            } else {
                const dsn =  process.env.DB_DSN || "mongodb://localhost:27017/chat";
                var db = require("mongo-amj").init(dsn, 'users');

                user = await db.get({"name": data.name});
                messages = await this.db.get({"city": data.city});
            }

            if (user.length > 0 && user[0].pw == data.pw) {
                for (var connected of this.users) {
                    if (connected.name == data.name) {
                        socket.emit('info', "User already connected.");
                        return;
                    }
                }
                callback(true);
                socket.username = data.name;
                socket.email = user[0].email;
                socket.city = data.city;
                socket.join(data.city);
                // console.log(socket.username + ' connected');
                var gravatar = this.gravatarUrl(socket.email, {size: 35});
                var dateTime = this.theDate();

                this.users.push({name: socket.username, city: socket.city, avatar: gravatar});
                this.connections.push(socket);
                // console.log("%s users online", this.connections.length);
                this.io.to(data.city).emit('chat message', {msg: socket.username + " connected", user: "Server", avatar: "https://i.stack.imgur.com/SE2cv.jpg", date: dateTime});
                this.saveMessage("Server", socket.username + " connected", "https://i.stack.imgur.com/SE2cv.jpg", data.city, dateTime);
                this.updateUsers(socket.city);

                socket.emit('build messages', messages);
            } else {
                socket.emit('info', "Wrong username or password.");
            }
        });
    }



    /**
    * Update list of connected users
    */
    updateUsers(city) {
        var room = [];
        var avatars = [];

        for (var user of this.users) {
            if (user.city == city) {
                room.push(user.name);
                avatars.push(user.avatar);
            }
        }
        this.io.to(city).emit('get users', {users: room, avatars: avatars, loc: city});
    }

    theDate() {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        return dateTime;
    }


    /**
    * Add message to database
    */
    async saveMessage(name, msg, gravatar, location, dateTime) {
        var item = {
            user: name,
            message: msg,
            avatar: gravatar,
            city: location,
            date: dateTime
        };

        try {
            await this.db.insert(item);
        } catch (err) {
            return;
        }
    }
}

module.exports = ChatServer;
