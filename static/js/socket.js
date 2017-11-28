$(function () {
    const socket = io({'transports': ['websocket', 'polling']});

    $('#messageForm').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(data) {
        console.log(data);
        $('#messages').append($('<li></li>').text(data.msg).prepend($('<strong></strong>').text(data.user + " ")));
    });

    $('#userForm').submit(function() {
        socket.emit('new user', $('#username').val(), function(data) {
            $('#login').hide();
            $('#chat').show();
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
    });
});
