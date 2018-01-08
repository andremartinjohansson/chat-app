var scrolled = false;

var onReady = function (client) {
    var socket;

    if (client != undefined) {
        socket = client({'transports': ['websocket', 'polling']});
    } else {
        try {
            socket = io({'transports': ['websocket', 'polling']}); //eslint-disable-line
        } catch (err) {
            return;
        }
    }

    $('#messageForm').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(data) {
        if (imageLink(data.msg)) {
            if (data.msg.includes(".jpg") || data.msg.includes(".png") || data.msg.includes(".jpeg") || data.msg.includes(".gif")) {
                data.msg = imageLink(data.msg);
            }
        } else if (videoLink(data.msg)) {
            data.msg = videoLink(data.msg);
        }
        $('#messages').append($('<li class="userItem"></li>').html(data.msg).append($('<span class="date">' + data.date + '</span>')).prepend($('<img class="gravatar" src=' + data.avatar + '><span class="msg-name"></span>').text(data.user + " "))); //eslint-disable-line
        updateScroll();
    });

    socket.on('build messages', function(items) {
        for (var item of items) {
            if (imageLink(item.message)) {
                if (item.message.includes(".jpg") || item.message.includes(".png") || item.message.includes(".jpeg") || item.message.includes(".gif")) {
                    item.message = imageLink(item.message);
                }
            } else if (videoLink(item.message)) {
                item.message = videoLink(item.message);
            }
            $('#messages').append($('<li class="userItem"></li>').html(item.message).append($('<span class="date">' + item.date + '</span>')).prepend($('<img class="gravatar" src=' + item.avatar + '><span class="msg-name"></span>').text(item.user + " "))); //eslint-disable-line
        }
        updateScroll();
    });

    $('#userForm').submit(function() {
        socket.emit('new user', {
            "name": $('#username').val(),
            "pw": $('#password').val(),
            "city": $('#city').val()
        }, function() {
            $('#login').hide();
            $('#chat').show();
            updateScroll();
        });
        $('#username').val('');
        return false;
    });
    socket.on('get users', function(data) {
        $('#users').html('');
        for (var i = 0; i < data.users.length; i++) {
            $('#users').append($('<li class="userItem"></li>').append($('<span class="usr-name"></span>').text(data.users[i])).append($('<img class="gravatar" src=' + data.avatars[i] + '>')));
            $('#onlineCount').html('(' + (i+1) + ')');
        }
        $('#cityHeader').html(data.loc);
        updateScroll();
    });
    socket.on('info', function(data) {
        $('#infoMessage').html(data);
    });

    $(document).on("click", ".userItem", function () {
        var name = $(this).find('span:first').text();

        $('#m').val('@' + name + ' ');
        $("#m").focus();
    });

    $(document).on("click", "#embedImg", function () {
        var link;

        if (!client) {
            link = prompt("Image Link:", "");
        } else {
            link = "https://www.w3schools.com/w3css/img_fjords.jpg";
        }

        if (link == null || link == "") {
            $('#m').val('');
        } else {
            $('#m').val('[img]' + link + '[/img]');
            $("#m").focus();
        }
    });

    $(document).on("click", "#embedVideo", function () {
        var link;

        if (!client) {
            link = prompt("Youtube Video Id:", "");
        } else {
            link = "OQsIV8fkgSA";
        }

        if (link == null || link == "") {
            $('#m').val('');
        } else {
            $('#m').val('[video]' + link + '[/video]');
            $("#m").focus();
        }
    });

    $("#messages").on('scroll', function() {
        var element = document.getElementById("messages");

        if (element.scrollTop === (element.scrollHeight - element.offsetHeight)) {
            scrolled = false;
        } else {
            scrolled = true;
        }
    });
};

var updateScroll = function() {
    if (!scrolled) {
        var element = document.getElementById("messages");

        element.scrollTop = element.scrollHeight;
        scrolled = false;
    }
};

var imageLink = function(msg) {
    if (msg.includes("[img]") || msg.includes("[IMG]")) {
        var link = msg.substring(msg.indexOf("]") + 1, msg.lastIndexOf("["));

        return '<img class="chat-img" src="' + link + '">';
    } else {
        return false;
    }
};

var videoLink = function(msg) {
    if (msg.includes("[video]") || msg.includes("[VIDEO]")) {
        var id = msg.substring(msg.indexOf("]") + 1, msg.lastIndexOf("["));


        return '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + id + '" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>';
    } else {
        return false;
    }
};

$(document).ready(function() {
    onReady(undefined);
});

module.exports = {
    client: onReady,
    updateScroll: updateScroll,
    imageLink: imageLink,
    videoLink: videoLink
};
