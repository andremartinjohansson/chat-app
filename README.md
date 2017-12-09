Ramverk 2 Chat Application
==============

[![Travis CI Build Status](https://api.travis-ci.org/andymartinj/chat-app.svg?branch=master)](https://travis-ci.org/andymartinj/chat-app)
[![Maintainability](https://api.codeclimate.com/v1/badges/40eeb6fc02893c2dfda2/maintainability)](https://codeclimate.com/github/andymartinj/chat-app/maintainability)
[![BCH compliance](https://bettercodehub.com/edge/badge/andymartinj/chat-app?branch=master)](https://bettercodehub.com/)
[![Scrutinizer](https://scrutinizer-ci.com/g/andymartinj/chat-app/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/andymartinj/chat-app/?branch=master)
[![Scrutinizer Build](https://scrutinizer-ci.com/g/andymartinj/chat-app/badges/build.png?b=master)](https://scrutinizer-ci.com/g/andymartinj/chat-app/?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/andymartinj/chat-app/badge.svg)](https://coveralls.io/github/andymartinj/chat-app)

Simple chat application where multiple users will be able to chat with each other.

**Note**: This is still WIP.

## Check it out

```
$ git clone https://github.com/andymartinj/chat-app.git
$ cd chat-app
$ npm install
$ npm start
```

**Note**: The default port is 1337. To change it, you need to set environment variable *CHAT_PORT*. Example, to set port to 3353:

```
$ export CHAT_PORT=3353
```

## Testing

```
$ make test
$ npm test
```

## Testing in docker

```
$ make test1
$ make test2
$ make test3
```

**Note**: The default dsn is set to localhost. It can be changed by setting the
*DB_DSN* environment variable.

```
$ export DB_DSN=mongodb://mongodb:27017/chat
```

## Setup with docker

```
$ docker-compose -up -d server
```

**Note**: Again, default port is 1337.
