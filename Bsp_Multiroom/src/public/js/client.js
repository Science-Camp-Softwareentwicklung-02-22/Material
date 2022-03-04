const socket = io();

// logMessage für Debug-Zwecke
socket.on('logMessage', msg => {
    console.log(msg);
});

function logMessage(msg) {
    socket.emit('logMessage', msg);
}

socket.on('update', num => {
    update(num)
})

function joinRoom(userName, room) {
    socket.emit('joinRoom', userName, room)
}