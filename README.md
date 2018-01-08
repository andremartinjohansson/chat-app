Ramverk 2 Chat Application
==============

[![Travis CI Build Status](https://api.travis-ci.org/andymartinj/chat-app.svg?branch=master)](https://travis-ci.org/andymartinj/chat-app)
[![Maintainability](https://api.codeclimate.com/v1/badges/40eeb6fc02893c2dfda2/maintainability)](https://codeclimate.com/github/andymartinj/chat-app/maintainability)
[![BCH compliance](https://bettercodehub.com/edge/badge/andymartinj/chat-app?branch=master)](https://bettercodehub.com/)
[![Scrutinizer](https://scrutinizer-ci.com/g/andymartinj/chat-app/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/andymartinj/chat-app/?branch=master)
[![Scrutinizer Build](https://scrutinizer-ci.com/g/andymartinj/chat-app/badges/build.png?b=master)](https://scrutinizer-ci.com/g/andymartinj/chat-app/?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/andymartinj/chat-app/badge.svg)](https://coveralls.io/github/andymartinj/chat-app)

## Intro

This is a simple chat application where you can register a user and login to a chat room based on cities and text chat with other people in that same room. Idea is, you pick the city in which you're in, and there you'll find other people in the same city. Good for planning meet ups or such. In this case, it's directed towards petrol heads or just car owners who might need help with their car or want to plan a car meet in their city.

## Features

|  Feature                                | Included? |
|:--------------------------------------- |:---------:|
| Register user (saved in NoSQL database) | Yes |
| User login with registered user | Yes |
| Gravatars based on email | Yes |
| Select which room to login to | Yes |
| Select room based on user's location | No |
| Login to multiple rooms | No |
| Message when a user (dis)connects | Yes |
| See users online in current room | Yes |
| Send messages to room | Yes |
| Save messages to database | Yes |
| Load old messages on connecting | Yes |
| Embed images | Yes |
| Embed Youtube videos | Yes |
| Send emojis | Yes |
| Highlighted message if @-mentioned | No |
| All kinds of error handling | Yes |
| Responsive & mobile friendly | Yes |

## Express, Pug, Socket.io, MongoDB

Express, of course, is a pretty popular and standard framework for Node.js. So this is what I've used for the project. It just makes it real easy handle routes, requests, response and everything else when creating an application like this. To not use Express wouldn't make any sense.

For template engine I've used Pug, simply because I was quite familiar with it and it's quite simple. My application has a total of three views, where one is the error page and one is the static register page. At first, I used pure HTML for the views, but as I needed to send some data to the views I decided to go with Pug. It allows this in a very simple way, so why go with anything else?

Socket.io is what I've used for websockets which allows the real-time chat to work between connected users. To me, Socket.io seems like the best and cleanest way when it comes to websockets. And it's real simple.

MongoDB is what I've used for the database. It's very simple to use for both messages and users, especially with my module [Mongo-AMJ](https://www.npmjs.com/package/mongo-amj). With that module, why would I ever use anything else?

Together, everything works really well I think. Possibly I could have used a different template engine, but Pug does the job just fine. Many other people use AngularJS for real-time applications, as it works well with dynamic content and single-page applications. Perhaps that would've been a better choice than Pug in the case of this real-time chat application. Otherwise, I think I made good choices.

## Install & Run Locally

This will run the application locally. Make sure you have MongoDB running locally as well. If you run MongoDB in docker, make sure to set the DB_DSN to correctly point to that.

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

**Note**: The default dsn is set to localhost. It can be changed by setting the
*DB_DSN* environment variable.

```
$ export DB_DSN=mongodb://localhost:27017/chat
```

## Run with docker (recommended)

```
$ make start-docker
```

**Note**: Again, default port is 1337.

To shut down the containers:

```
$ make stop-docker
```

## Run tests

```
$ make test
$ npm test
```

## Run tests in docker

This will run tests in different versions of node (latest, 7 and 6).

```
$ make test1
$ make test2
$ make test3
```

**Note**: This will start a container with mongodb which will be used for testing
database. Test3 *will* fail as async/await is not supported in node 6.


## Testing

The following tools are used for tests:

* Mocha
* Chai
* nyc
* stylelint
* eslint
* supertest
* jsdom-global

When running tests, first you'll get results from stylelint and eslint. They check all relevant files in the project, except for the */static/jquery-emoji-picker* which really is an external module with its own tests and such. Aside from that, all files are checked for errors.

Then npm test will run the unit tests and all that and present code coverage. I have included all files I consider relevant. Aside from index.js and app.js (and emoji picker), all js files have tests written for them. This includes *socket.js*, which is the client side for the sockets, and *chatserver.js*, which is the server side of sockets, as well as all the *routes* which are tested with supertest.

Sockets are difficult to test. Period. But, I managed to reach over 90% code coverage on *chatserver.js* which I'm quite proud of. However, I had to make some changes in the script to allow tests to run smoothly. And I had to make sure the tests are running inside a server, meaning I have to start a server on port 1337 inside the tests. If 1337 is busy, well, I guess the tests won't run. The remaining % of the script that isn't tested is because of error handling, code that is executed if something goes wrong. For example, to get 100% I'd have to make sure there isn't a connected database, which isn't easy to do as I need a database running for other things.

The client side, *socket.js* was much harder to test, or rather, make testable. But with help of jsdom-global I was able to simulate a browser, and thus simulate clicks that activate certain functions. The main function in the script activates on document ready, which meant I had to give the function (as well as the helper functions) a proper name to use it in tests. But having done that, it was actually quite easy. However, some simulations cannot be done inside the jsdom, like form submits. This meant that I couldn't test those functions. As far as I could tell, jsdom-global was the best module for this kind of testing, but perhaps there are other modules that allow this? Also, I did not test the socket functions inside the script. Testing sockets on server side was difficult enough. As a result, I only reached about 50% coverage on this file.

As for the routes, the only code that isn't tested in them has to do with sessions. There are modules that could probably be used to test session variables but I put that aside for now.

Locally I get a total coverage of 70%. For some reason coveralls reports differently - 65%. 

## CI

The following services are used for Continuous Integration:

* Travis
* Code Climate
* Better Code Hub
* Scrutinizer
* Coveralls

Together, I think these services give me a great overview of my project and its code. How maintainable my code is, the quality of it, the code coverage and even what I can do to improve my code. I can make sure my build is passing by running it through Travis and Scrutinizer. Code Climate, Better Code Hub and Scrutinizer all report some sort of quality of my code, but in very different ways. That is why I have included all three of them - for the best possible overview of my code quality. This allows me to improve in every way possible when writing code. Coveralls integrates beautifully with Travis, and reports code coverage in a very pleasing and likeable way. That's why I've picked Coveralls for coverage.

All-in-all I think my code quality could possibly be better, but considering the complexity of the sockets and all that, I'm okay with it.

## Real-time

For the real-time aspect in this project I've used Socket.io - web sockets - to create a real-time chat. It allows me to send data between client and server seamlessly. You have *emit* events and *on* events. For example, an *emit* event will emit a message to all connected sockets, and the *on* event will activate when the message is emitted. So when a user submits a message to the chat, that message will be emitted and when that happens, the *on* event on the server side will save the message to the database.

It just works really great, and Socket.io specifically has been a blast to play around with.

## Database

For database I picked MongoDB, a "Document Database" which is probably the most popular NoSQL database there is. The simplicity of it together with the dynamism makes it really great for things like saving and storing chat messages. In the case of my chat application it works really well.

However, when dealing with users it's quite good to have relationships in the database, and I missed that when using MongoDB and handling the users. Probably it would have been better to use a normal SQL database for this.

So, NoSQL is good for smaller projects, right? Ones that don't have users that have things tied to them. In the future, when doing projects with users, I'd probably go with SQL. If this project didn't have users, a NoSQL would have sufficed for storing the messages.

## Modules

I have used one of my own modules in this project:

* [Mongo-AMJ](https://www.npmjs.com/package/mongo-amj)

This module makes it easier to communicate with the MongoDB database. It allows you to easily connect to your desired collection in the database, and then you have an API for the basic functions like *get/find*, *insert*, *update*, *delete*. This reduces the amount of code in your scripts. One line for connecting to the database. One line for executing whatever function you want.

NPM in general is probably the world's greatest package manager in my opinion. So easy to use, both for creating your own modules and download other ones.
