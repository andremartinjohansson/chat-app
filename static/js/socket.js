var scrolled = false;

$(function () {
    const socket = io({'transports': ['websocket', 'polling']}); //eslint-disable-line

    $('#messageForm').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(data) {
        $('#messages').append($('<li></li>').text(data.msg).prepend($('<span class="msg-name"></span>').text(data.user + " ")));
        updateScroll();
    });

    $('#userForm').submit(function() {
        socket.emit('new user', $('#username').val(), function(data) {
            $('#login').hide();
            $('#chat').show();
            updateScroll();
        });
        $('#username').val('');
        return false;
    });
    socket.on('get users', function(data) {
        $('#users').html('');
        for (i = 0; i < data.length; i++) {
            $('#users').append($('<li></li>').text(data[i]));
            $('#onlineCount').html('(' + (i+1) + ')');
        }
        updateScroll();
    });

    $("#messages").on('scroll', function() {
        var element = document.getElementById("messages");
        if (element.scrollTop === (element.scrollHeight - element.offsetHeight)) {
            scrolled = false;
        } else {
            scrolled = true;
        }
    });
});

function updateScroll() {
    if (!scrolled) {
        var element = document.getElementById("messages");
        element.scrollTop = element.scrollHeight;
        scrolled = false;
    }
}
